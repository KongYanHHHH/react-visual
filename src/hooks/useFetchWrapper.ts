import getCookie from '@/uilts/getCookie';
import { message } from 'antd';
import apiUri from '@/uilts/api_uri';

enum Method {
    GET = 'GET',
    HEAD = 'HEAD',
    DELETE = 'DELETE',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS',
}

type CreateConfig = {
    baseURL: string;
    headers?: Headers;
};

type FetchBody =
    | Blob
    | BufferSource
    | FormData
    | URLSearchParams
    | ReadableStream<Uint8Array>
    | string
    | File;

interface FetchOptions {
    url?: string;
    headers?: Headers;
    body?: FetchBody;
    params?: URLSearchParams;
}

// 线上将uri加上/egg
const urlRewrite = (path: string) =>
    isAbsoluteURL(path) ? path : path.replace(/^\/api(.*)$/, '/api/egg$1');

const isAbsoluteURL = (url: string) => /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);

class FetchWrapper {
    private static instance: FetchWrapper | null = null;

    static #baseURL: string = '';
    static #headers: Headers;

    apiUri = apiUri;

    private constructor(config: CreateConfig) {
        FetchWrapper.#baseURL = config.baseURL;
        if (config.headers) {
            FetchWrapper.#headers = config.headers;
        }
    }

    public static createFetchWrapperInstance(
        config: CreateConfig,
    ): FetchWrapper {
        if (!FetchWrapper.instance) {
            FetchWrapper.instance = new FetchWrapper(config);
        }
        return FetchWrapper.instance;
    }

    static setXsrfToken() {
        FetchWrapper.#headers.set('x-csrf-token', getCookie('csrfToken'));
    }

    static #mergeHeaders(obj?: Object | Headers) {
        if (obj instanceof Headers) {
            for (const [_key, _val] of obj.entries()) {
                FetchWrapper.#headers.set(_key, _val);
            }
        } else if (obj) {
            for (const [_key, _val] of Object.entries(obj)) {
                FetchWrapper.#headers.set(_key, _val);
            }
        }
        return FetchWrapper.#headers;
    }

    static #commonFetch(
        url: string,
        method: Method,
        options: FetchOptions = {},
    ) {
        const fullUrl =
            FetchWrapper.#baseURL + process.env.NODE_ENV === 'development'
                ? url
                : urlRewrite(url);

        options = Object.assign(
            {
                url: fullUrl,
                method,
                // mode // 跨域
                // cache // 缓存
                // signal: null, // AbortController中断控制器
                // credentials:'include', // 跨域启用cookie发送，默认同源same-origin
            },
            options,
        );

        options.headers = this.#mergeHeaders(options.headers);

        if (options.params) {
            let queryString = Object.entries(options.params)
                .map(item => {
                    return `${encodeURIComponent(item[0])}=${encodeURIComponent(
                        item[1],
                    )}`;
                })
                .join('&');
            options.url = options.url + '?' + queryString;
        }

        if (options.body) {
        }

        this.setXsrfToken();

        const uri = options.url as string;
        Reflect.deleteProperty(options, 'url');

        return fetch(uri, options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject({
                        status: response.status,
                        statusText: response.statusText,
                    });
                }
            })
            .catch(e => {
                switch (e.status) {
                    case 500:
                    case 501:
                    case 502:
                    case 503:
                        message.error('服务器出错啦');
                        break;
                    case 404:
                        message.error('无法找到资源');
                        break;
                    case 403:
                    case 401:
                        message.error('无权限');
                        // const user = useUserStore();
                        // user.token = '';
                        // router.push('/');
                        break;
                    default:
                        message.error(`I don't know.`);
                }
                return Promise.reject({
                    errorMessage: e,
                });
            });
    }

    get(url: string, options: FetchOptions = {}) {
        return FetchWrapper.#commonFetch(url, Method.GET, options);
    }
    head() {}
    delete() {}
    post(url: string, body: FetchBody, options: FetchOptions = {}) {
        if (options.body) {
            options.body = Object.assign(options.body, body);
        } else {
            options.body = body;
        }
        return FetchWrapper.#commonFetch(url, Method.POST, options);
    }
    put() {}
    patch() {}
    options() {}
}

export default function useFetchWrapper() {
    const token = sessionStorage.getItem('token') ?? '';

    const headers = new Headers();
    headers.append('x-csrf-token', getCookie('csrfToken'));
    headers.append('Content-Type', 'application/json');
    headers.append('yan-token', token);

    // Apifox token
    headers.append('apifoxToken', 'aExxP_0RHrepUlxB9Tt3g');

    const fetchInstance = FetchWrapper.createFetchWrapperInstance({
        baseURL:
            process.env.NODE_ENV === 'development'
                ? ''
                : 'http://visual.yan121.com',
        headers,
    });

    return fetchInstance;
}
