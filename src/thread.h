#ifdef __WIN32__
    #include <windows.h>
    
    typedef HANDLE mutex_t;
    typedef HANDLE thread_t;
    
    #define mutex_init(m) m = CreateMutex(NULL, FALSE, NULL)
    #define mutex_lock(m) WaitForSingleObject(m, INFINITE)
    #define mutex_unlock(m) ReleaseMutex(m)
    #define mutex_destroy(m) CloseHandle(m)
    
    #define thread_init(t, func, arg) t = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)func, arg, 0, NULL)
    #define thread_join(t) WaitForSingleObject(t, INFINITE)
    
    static inline int cpu_cores() {
        SYSTEM_INFO sysinfo;
        GetSystemInfo(&sysinfo);
        return sysinfo.dwNumberOfProcessors;
    }
#else
    #include <pthread.h>
    #include <assert.h>

    typedef pthread_mutex_t mutex_t;
    typedef pthread_t thread_t;

    #define mutex_init(m) pthread_mutex_init(&(m), NULL)
    #define mutex_lock(m) assert(pthread_mutex_lock(&(m)) == 0)
    #define mutex_unlock(m) pthread_mutex_unlock(&(m))
    #define mutex_destroy(m) pthread_mutex_destroy(&(m))

    #define thread_init(t, func, arg) pthread_create(&t, NULL, func, arg)
    #define thread_join(t) pthread_join(t, NULL)
    
    static inline int cpu_cores() {
        return sysconf(_SC_NPROCESSORS_ONLN);
    }
#endif