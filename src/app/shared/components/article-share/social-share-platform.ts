import { SocialSharePlatformEnum } from 'src/app/constant/enums';
import { capitalizeFirstLetter } from 'src/app/utility/utils';

export interface SocialSharePlatform {
    key: string;
    title: string;
    imageUrl: string;
    colorImageUrl?: string;
    shareUrl: string;
}

export const socialSharePlatforms: SocialSharePlatform[] = [
    {
        key: SocialSharePlatformEnum.Facebook,
        title: capitalizeFirstLetter(SocialSharePlatformEnum.Facebook),
        imageUrl: '/assets/images/facebook-black.svg',
        colorImageUrl: '/assets/images/facebook-color.svg',
        shareUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
    },
    {
        key: SocialSharePlatformEnum.Twitter,
        title: capitalizeFirstLetter(SocialSharePlatformEnum.Twitter),
        imageUrl: '/assets/images/twitter-black.svg',
        colorImageUrl: '/assets/images/twitter-color.svg',
        shareUrl: 'https://twitter.com/intent/tweet?url=',
    },
    {
        key: SocialSharePlatformEnum.LinkedIn,
        title: capitalizeFirstLetter(SocialSharePlatformEnum.LinkedIn),
        imageUrl: '/assets/images/linkedin-black.svg',
        colorImageUrl: '/assets/images/linkedin-color.svg',
        shareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=',
    },
    {
        key: SocialSharePlatformEnum.WhatsApp,
        title: capitalizeFirstLetter(SocialSharePlatformEnum.WhatsApp),
        imageUrl: '/assets/images/whatsapp.png',
        colorImageUrl: '/assets/images/whatsapp-icon.png',
        shareUrl: 'https://wa.me?text=',
    },
];
