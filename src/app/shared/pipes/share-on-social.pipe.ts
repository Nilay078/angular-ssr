import { Pipe, PipeTransform } from "@angular/core";
import { SocialSharePlatform, socialSharePlatforms } from "../components/article-share/social-share-platform";
import * as _ from "lodash";

@Pipe({name: 'shareOnSocial'})
export class ShareOnSocialPipe implements PipeTransform {
    transform(value: string, platform: string) {
        const socialSharePlatform =  _.find(socialSharePlatforms, (social: SocialSharePlatform) => {
            return social.key === platform;
        });

        if(!socialSharePlatform) {
            return;
        }
        return `${socialSharePlatform.shareUrl}${value}`;
    }
}