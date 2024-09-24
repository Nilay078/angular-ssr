import { Entity, File } from 'src/app/common/interfaces/entities/entity';

export interface Article extends Entity {
    title: string;
    bannerFileView: File;
    thumbnailImageView: File;
    subHeading: string;
    authorView?: Author;
    authorViews?: Author[];
    slug?: string;
    publishDate?: number;
    updateDate?: number;
    bookMark?: boolean;
    metaTitle: string;
    metaDescription: string;
    metaKeyword?: string;
    url?: string;
}

export interface Author extends Article {
    displayName: string;
    imageFileView?: File;
    socialMediaViewList?: SocialMediaView[];
}

export interface SocialMediaView extends Entity {
    socialMediaLink: string;
}
