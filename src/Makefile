PROD=minecount
CC=clang
AR=ar
LD=$(CC)
ARCH=
CFLAGS=-Wall -Werror -Wextra -std=c99 -D_GNU_SOURCE -O3 $(ARCH)
LIBS=$(ARCH) -lz -lpthread
OBJS=main.o inventory.o cNBT/libnbt.a

all: $(PROD)

$(PROD): $(OBJS)
	$(LD) $^ -o $(PROD) $(LIBS)

cNBT/libnbt.a: cNBT
	CC=$(CC) AR=$(AR) make -C cNBT libnbt.a

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

test: all always
	./$(PROD) -wci /Users/zydeco/Desktop/1845/project1845/ test.json
	md5 test.json

mapshift: mapshift.c mcr.c mcr.h cNBT/libnbt.a
	$(CC) $(CFLAGS) $(LIBS) mapshift.c mcr.c cNBT/libnbt.a -o mapshift

rewritemap: rewritemap.c mcr.c mcr.h cNBT/libnbt.a
	$(CC) $(CFLAGS) $(LIBS) -DUSE_LIBDISPATCH rewritemap.c mcr.c cNBT/libnbt.a -o rewritemap

always:

clean:
	rm -rf $(OBJS) $(PROD) mapshift rewritemap
	make -C cNBT clean
