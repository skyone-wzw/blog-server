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
    editor(slug?: string) {
        slug = slug ? `/${slug}` : "";
        return `/editor${slug}`;
    },

    // assets
    cover(slug: string, blur: boolean = false) {
        const url = `/api/cover/${slug}`;
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
            const url = `/assets/image/custom/${file}`;
            return blur ?
                `/_next/image?url=${encodeURIComponent(url)}&w=8&q=75` :
                url;
        }
    },
    avatar: {
        email(email: string): string {
            return `/api/avatar/email/${email}`;
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
            return "/"; // TODO: impl later
        },
    },
};

export default L;
