const L = {
    // pages
    post(slug: string) {
        return `/post/${slug}`;
    },
    tags(tag?: string) {
        tag = tag ? `/${encodeURIComponent(tag)}` : "";
        return `/tags${tag}`;
    },
    series(series?: string) {
        series = series ? `/${encodeURIComponent(series)}` : "";
        return `/series${series}`;
    },
    archive(year?: string | number, page?: string | number) {
        year = year ? `/${year}` : "";
        page = page ? `/page/${page}` : "";
        return `/archive${year}${page}`;
    },
    page(page: string = "") {
        page = encodeURIComponent(page);
        return `/${page}`;
    },
    homePagination(page: string | number) {
        return `/page/${page}`;
    },
    admin(page?: string) {
        return `/admin${page ? `/${page}` : ""}`;
    },
    editor: {
        post(slug?: string) {
            slug = slug ? `/${slug}` : "";
            return `/editor/post${slug}`;
        },
        custom(slug?: string) {
            return `/editor/custom${slug ?? ""}`;
        }
    },
    custom(path: string | string[]) {
        if (Array.isArray(path)) {
            path = "/" + path.join("/");
        }
        return path;
    },

    // assets
    cover(slug: string, timestamp: number, icon: string, blur: boolean = false) {
        const url = `/api/cover/${slug}?t=${timestamp}&i=${icon}`;
        return blur ?
            `/_next/image?url=${encodeURIComponent(url)}&w=8&q=75` :
            url;
    },
    image: {
        post(file: string, blur: boolean = false) {
            const url = `/assets/image/post/${file}`;
            return blur ?
                `/_next/image?url=${encodeURIComponent(url)}&w=8&q=75` :
                url;
        },
        custom(file: string, blur: boolean = false) {
            if (file.startsWith("/default")) {
                // 兼容默认配置
                return blur ?
                    `/_next/image?url=${encodeURIComponent(file)}&w=8&q=75` :
                    file;
            }
            const url = `/assets/image/custom/${file}`;
            return blur ?
                `/_next/image?url=${encodeURIComponent(url)}&w=8&q=75` :
                url;
        }
    },
    avatar: {
        email(email: string): string {
            return `/api/avatar/${email}`;
        },
        external(url: string): string {
            return url;
        },
    },

    // external links
    social: {
        github(username: string) {
            return `https://github.com/${username}`;
        },
        zhihu(username: string) {
            return `https://www.zhihu.com/people/${username}`;
        },
        email(email: string) {
            return `mailto:${email}`;
        },
        rss() {
            return "/atom.xml";
        },
    },
};

export default L;
