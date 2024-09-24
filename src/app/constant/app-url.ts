import { environment } from 'src/environments/environment';

export class AppUrlConstant {
    public static readonly SOCIAL_MEDIA_FACEBOOK = 'https://www.facebook.com/secretariat.in';
    public static readonly SOCIAL_MEDIA_INSTAGRAM = 'https://www.instagram.com/secretariat.in/';
    public static readonly SOCIAL_MEDIA_TWITTER = 'https://twitter.com/secretariat_in';
    public static readonly SOCIAL_MEDIA_LINKEDIN = 'https://www.linkedin.com/company/secretariat-in';
    public static readonly REACH_OUT_MAIL_ID = 'connect@thesecretariat.in';

    public static readonly PRIVATE = 'private';
    public static readonly PUBLIC = 'public';
    public static readonly UNAUTHORIZED = 'unauthorized';
    public static readonly PAGE_NOT_FOUND = 'page-not-found';

    public static readonly LOGIN = 'login';
    public static readonly JOIN_WAITLIST = 'join-our-waitlist';
    public static readonly EXCLUSIVE_LOGIN = 'exclusive-login';
    public static readonly SUCCESS_WAIT_LIST = 'success-wait-list';
    public static readonly HOME = 'home';
    public static readonly REGISTRATION = 'registration';
    public static readonly ARTICLE_VIEW = 'article';
    public static readonly VERIFICATION = 'verification';
    public static readonly USER_REGISTRATION = 'user-registration';
    public static readonly LOGICAL = 'logical';
    public static readonly CATEGORY = 'category';
    public static readonly TAG = 'tag';
    public static readonly AUTHOR = 'author';
    public static readonly STATE = 'state';
    public static readonly SUB_CATEGORY = 'sub-category';
    public static readonly MORE = 'more';
    public static readonly ABOUT_US = 'about-us';
    public static readonly CONTACT = 'contact';
    public static readonly WRITE_FOR_US = 'write-for-us';
    public static readonly DAILY_SKIM = 'daily-skim';
    public static readonly DEEP_DIVE = 'deep-dive';
    public static readonly FEEDBACK = 'feedback';
    public static readonly TERMS_CONDITIONS = 'terms-and-conditions';
    public static readonly PRIVACY_POLICY = 'privacy-policy';
    public static readonly PAYMENT_POLICY = 'payment-policy';
    public static readonly ARTICLE_SEARCH = 'article-search';
    public static readonly LOCATION_SELECTION = 'location-selection';

    public static readonly DASHBOARD = 'dashboard';
    public static readonly BOOKMARKS = 'bookmarks';
    public static readonly MY_ACCOUNT = 'my-account';
    public static readonly EDIT_PROFILE = 'edit-profile';
    public static readonly EDIT_PREFERENCES = 'edit-preferences';
    public static readonly NEWSLETTER_SUBSCRIPTION = 'news-letter-subscription';
    public static readonly RECENT_VIEW = 'recent-view';
    public static readonly STATIC_ARTICLE = 'public/article/patnaik-pandian-and-the-intriguing-story-of-odisha-politics-01';
}
export class Url {
    private static readonly PRIVATE = `/${AppUrlConstant.PRIVATE}/`;

    public static readonly HOME = `${AppUrlConstant.HOME}`;
    public static readonly EXCLUSIVE_LOGIN = `${AppUrlConstant.EXCLUSIVE_LOGIN}`;
    public static readonly SUCCESS_WAIT_LIST = `${AppUrlConstant.SUCCESS_WAIT_LIST}`;
    public static readonly LOGIN = `${AppUrlConstant.LOGIN}`;
    public static readonly JOIN_WAITLIST = `${AppUrlConstant.JOIN_WAITLIST}`;
    public static readonly MORE = `${AppUrlConstant.MORE}`;
    public static readonly DAILY_SKIM = `${AppUrlConstant.DAILY_SKIM}`;
    public static readonly DEEP_DIVE = `${AppUrlConstant.DEEP_DIVE}`;
    public static readonly ARTICLES_BY_CATEGORY = `${AppUrlConstant.ARTICLE_VIEW}/${AppUrlConstant.CATEGORY}/`;
    public static readonly ARTICLES_BY_LOGICAL = `${AppUrlConstant.ARTICLE_VIEW}/${AppUrlConstant.LOGICAL}/`;
    public static readonly ARTICLES_BY_TAG = `${AppUrlConstant.ARTICLE_VIEW}/${AppUrlConstant.TAG}/`;
    public static readonly ARTICLES_BY_AUTHOR = `${AppUrlConstant.ARTICLE_VIEW}/${AppUrlConstant.AUTHOR}/`;
    public static readonly ARTICLES_BY_STATE = `${AppUrlConstant.ARTICLE_VIEW}/${AppUrlConstant.STATE}/`;

    public static readonly ARTICLE_VIEW = `${AppUrlConstant.ARTICLE_VIEW}`;
    public static readonly ARTICLE_SEARCH = `${AppUrlConstant.ARTICLE_SEARCH}`;
    public static readonly VERIFICATION = `${AppUrlConstant.VERIFICATION}`;
    public static readonly USER_REGISTRATION = `${AppUrlConstant.USER_REGISTRATION}`;
    public static readonly ABOUT_US = `${AppUrlConstant.ABOUT_US}`;
    public static readonly CONTACT = `${AppUrlConstant.CONTACT}`;
    public static readonly WRITE_FOR_US = `${AppUrlConstant.WRITE_FOR_US}`;
    public static readonly FEEDBACK = `${AppUrlConstant.FEEDBACK}`;
    public static readonly TERMS_CONDITIONS = `${AppUrlConstant.TERMS_CONDITIONS}`;
    public static readonly PRIVACY_POLICY = `${AppUrlConstant.PRIVACY_POLICY}`;
    public static readonly PAYMENT_POLICY = `${AppUrlConstant.PAYMENT_POLICY}`;

    public static readonly CATEGORY = `${AppUrlConstant.CATEGORY}`;
    public static readonly SUB_CATEGORY = `${AppUrlConstant.SUB_CATEGORY}`;

    public static readonly BOOKMARKS = `${Url.PRIVATE}${AppUrlConstant.BOOKMARKS}`;
    public static readonly MY_ACCOUNT = `${Url.PRIVATE}${AppUrlConstant.MY_ACCOUNT}`;
    public static readonly EDIT_PROFILE = `${Url.PRIVATE}${AppUrlConstant.EDIT_PROFILE}`;
    public static readonly EDIT_PREFERENCES = `${Url.PRIVATE}${AppUrlConstant.EDIT_PREFERENCES}`;
    public static readonly NEWSLETTER_SUBSCRIPTION = `${Url.PRIVATE}${AppUrlConstant.NEWSLETTER_SUBSCRIPTION}`;
    public static readonly RECENT_VIEW = `${Url.PRIVATE}${AppUrlConstant.RECENT_VIEW}`;
}

export class ApiUrl {
    private static readonly API_URL = `${environment.apiUrl}`;
    private static readonly PUBLIC_API_URL = `${ApiUrl.API_URL}/${AppUrlConstant.PUBLIC}/`;
    private static readonly PRIVATE_API_URL = `${ApiUrl.API_URL}/${AppUrlConstant.PRIVATE}/`;

    //public module related APIs
    public static readonly PUBLIC_ARTICLE_LAYOUT_API = `${ApiUrl.PUBLIC_API_URL}/page`;
    public static readonly PUBLIC_ARTICLE_VIEW = `${ApiUrl.PUBLIC_API_URL}/content/view`;
    public static readonly PUBLIC_MOBILE_SEARCH = `${ApiUrl.PUBLIC_API_URL}/content/article/search`;
    public static readonly PRIVATE_ARTICLE_LAYOUT_API = `${ApiUrl.PRIVATE_API_URL}/page`;
    public static readonly PRIVATE_ARTICLE_VIEW = `${ApiUrl.PRIVATE_API_URL}/content/view/`;
    public static readonly PRIVATE_MOBILE_SEARCH = `${ApiUrl.PRIVATE_API_URL}/content/article/search`;
    public static readonly PUBLIC_ARTICLE_BY_STATE = `${ApiUrl.PUBLIC_API_URL}content/article-by-state`;
    public static readonly PRIVATE_ARTICLE_BY_STATE = `${ApiUrl.PRIVATE_API_URL}content/article-by-state`;

    //share article meta info API
    public static readonly ARTICLE_META_INFO = `${ApiUrl.PUBLIC_API_URL}/content/meta-info/`;
    public static readonly ARTICLE_REDIRECT = `${ApiUrl.PUBLIC_API_URL}/content/redirect/`;

    //logout API
    public static readonly LOGOUT_API = `${ApiUrl.PRIVATE_API_URL}/user/logout`;

    public static readonly PUBLIC_UPLOAD_FILE = `${ApiUrl.PUBLIC_API_URL}/file/upload-writeforus-attachment`;
    public static readonly PRIVATE_UPLOAD_FILE = `${ApiUrl.PRIVATE_API_URL}/file/upload-writeforus-attachment`;
    public static readonly DOWNLOAD_IMAGE = `${ApiUrl.PUBLIC_API_URL}/file/download-content-attachment?fileId=`;

    public static readonly USER_REGISTER = `${ApiUrl.PUBLIC_API_URL}/user/save-registration-mobile`;
    public static readonly RESEND_OTP_API = `${ApiUrl.PRIVATE_API_URL}/user/resend-mobile-otp`;
    public static readonly OTP_VERIFICATION_API = `${ApiUrl.PRIVATE_API_URL}/user/verify-mobile`;
    public static readonly USER_UPDATE = `${ApiUrl.PRIVATE_API_URL}/user/update-user`;
    public static readonly CATEGORY_UPDATE = `${ApiUrl.PRIVATE_API_URL}/user/update-category`;
    public static readonly PROFILE_UPDATE = `${ApiUrl.PRIVATE_API_URL}/user/update-profile`;
    public static readonly USER_SAVE = `${ApiUrl.PRIVATE_API_URL}/user/save-user-profile`;
    public static readonly USER_VIEW = `${ApiUrl.PRIVATE_API_URL}/user/view`;

    public static readonly PRIVATE_CONTACT_US = `${ApiUrl.PRIVATE_API_URL}/contactus/save`;
    public static readonly PUBLIC_CONTACT_US = `${ApiUrl.PUBLIC_API_URL}/contactus/save`;
    public static readonly PRIVATE_WRITE_FOR_US = `${ApiUrl.PRIVATE_API_URL}/writeforus/save`;
    public static readonly PUBLIC_WRITE_FOR_US = `${ApiUrl.PUBLIC_API_URL}/writeforus/save`;

    public static readonly PUBLIC_CATEGORY_SEARCH = `${ApiUrl.PUBLIC_API_URL}/category/root-and-its-leaf-child`;
    public static readonly PRIVATE_CATEGORY_SEARCH = `${ApiUrl.PRIVATE_API_URL}/category/root-and-its-leaf-child`;

    public static readonly PUBLIC_EXCLUSIVE_CODE_VERIFICATION = `${ApiUrl.PUBLIC_API_URL}/user/subscribe-now/`;
    public static readonly PRIVATE_EXCLUSIVE_CODE_VERIFICATION = `${ApiUrl.PRIVATE_API_URL}/user/subscribe-now/`;
    public static readonly WAIT_LIST = `${ApiUrl.API_URL}/wait-list/save`;

    public static readonly SAVE_BOOKMARK = `${ApiUrl.PRIVATE_API_URL}article/bookmark/operation`;
    public static readonly SEARCH_BOOKMARK = `${ApiUrl.PRIVATE_API_URL}article/bookmark/search`;

    public static readonly PUBLIC_SEARCH_RECENT_VIEW = `${ApiUrl.PUBLIC_API_URL}content/recently-view`;
    public static readonly PRIVATE_SEARCH_RECENT_VIEW = `${ApiUrl.PRIVATE_API_URL}content/recently-view`;

    public static readonly PUBLIC_FEEDBACK_DROPDOWN = `${ApiUrl.PUBLIC_API_URL}feedback/dropdown/`;
    public static readonly PRIVATE_FEEDBACK_DROPDOWN = `${ApiUrl.PRIVATE_API_URL}feedback/dropdown/`;
    public static readonly PUBLIC_SAVE_FEEDBACK = `${ApiUrl.PUBLIC_API_URL}feedback/save`;
    public static readonly PRIVATE_SAVE_FEEDBACK = `${ApiUrl.PRIVATE_API_URL}feedback/save`;

    public static readonly PUBLIC_FILTER_OPTION = `${ApiUrl.PUBLIC_API_URL}content/article-filter-option`;
    public static readonly PRIVATE_FILTER_OPTION = `${ApiUrl.PRIVATE_API_URL}content/article-filter-option`;
    public static readonly PUBLIC_SEARCH_ARTICLE_RESULT = `${ApiUrl.PUBLIC_API_URL}content/search-article`;
    public static readonly PRIVATE_SEARCH_ARTICLE_RESULT = `${ApiUrl.PRIVATE_API_URL}content/search-article`;

    public static readonly NEWSLETTER_SEARCH = `${ApiUrl.PRIVATE_API_URL}/article/news-letter/search`;
    public static readonly PUBLIC_NEWSLETTER_SUBSCRIBE = `${ApiUrl.PUBLIC_API_URL}article/news-letter-subscription/save`;
    public static readonly PRIVATE_NEWSLETTER_SUBSCRIBE = `${ApiUrl.PRIVATE_API_URL}article/news-letter-subscription/save`;

    public static readonly CATEGORY_WISE_TAG_LIST = `${ApiUrl.PUBLIC_API_URL}content/get-categorywise-tag`;

    public static readonly STATE_LIST_SEARCH = `${ApiUrl.PUBLIC_API_URL}state/list-for-search`;
    public static readonly STATE_LIST_USER = `${ApiUrl.PUBLIC_API_URL}state/list-for-user`;
    public static readonly UPDATE_USER_STATE = `${ApiUrl.PRIVATE_API_URL}user/update-state`;

    //device token validate
    public static readonly VALIDATE_DEVICE_TOKEN = `${ApiUrl.PUBLIC_API_URL}/user/validate-device-token`;
}
