/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SEOService } from './seo.service';

@Injectable({
    providedIn: 'root',
})
export class PageResolver implements Resolve<any> {
    constructor(private seoService: SEOService) {}

    async resolve(route: ActivatedRouteSnapshot) {
        const pageSlug: string = route.params['slug'];
        const metaData: any = {};
        metaData.url = pageSlug;
        if (pageSlug === 'daily-skim') {
            metaData.metaTitle = 'Daily Skim - The Secretariat News';
            metaData.metaDescription =
                'Get the latest headlines & summaries of top stories across all categories - delivered daily in our Daily Skim.  Stay informed quickly and easily';
            this.updateMeta(metaData);
        }
        if (pageSlug === 'deep-dive') {
            metaData.metaTitle = 'Deep Dive - The Secretariat News';
            metaData.metaDescription =
                'Dive deeper into the stories that matter. Our Deep Dives category curates the most recent in-depth explorations across all subjects';
            this.updateMeta(metaData);
        }
        if (pageSlug === 'about-us') {
            metaData.metaTitle = 'About Us - The Secretariat News';
            metaData.metaDescription =
                'The Secretariat, a non-partisan chronicler of public policy developments and their interface with business and society';
            this.updateMeta(metaData);
        }
        if (pageSlug === 'privacy-policy') {
            metaData.metaTitle = 'About Us - The Secretariat News';
            metaData.metaDescription =
                'The Secretariat, a non-partisan chronicler of public policy developments and their interface with business and society';
            this.updateMeta(metaData);
        }
        if (pageSlug === 'terms-and-conditions') {
            metaData.metaTitle = 'Terms and Conditions - The Secretariat News';
            metaData.metaDescription =
                'Learn about the rules that govern our website and how we interact with users. Our Terms & Conditions ensure a smooth experience for everyone.';
            this.updateMeta(metaData);
        }
        if (pageSlug === 'payment-policy') {
            metaData.metaTitle = 'Payment Policy - The Secretariat News';
            metaData.metaDescription =
                'This document outlines the policies related to Shipping, Refunds, Pricing, and Cancellation for www.thesecretariat.in, a subscription-based digital news website.';
            this.updateMeta(metaData);
        }
        return metaData;
    }

    updateMeta(metaData: any) {
        this.seoService.updateMetaData(metaData);
        this.seoService.updateOpenGraph(metaData);
        this.seoService.updateTwitterOpenGraph(metaData);
    }
}
