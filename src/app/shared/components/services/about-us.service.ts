import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AboutUsService {
    content: any = [
        'Policy. Governance. Bureaucracy. Business.',
        'These are the four key pillars of The Secretariat, a non-partisan chronicler of public policy developments and their interface with business and society.',
        'India, today, is the fastest growing large economy in the world and is well on its way to become a developed nation. But, despite more than thirty years of economic liberalisation, the governments, at both the Centre and states, still permeate wide dimensions of citizen and business life.',
        'The government determines not only the quality of life of people but also the means of our individual and collective aspirations.',
        'That is the fundamental basis by which we have begun our journey with The Secretariat as a new-age, new media and multi-media platform that will provide the reader insights, inside stories, analysis, commentaries from leading influencers and breaking news and views from the corridors of power as only we can.',
        'The Secretariat will focus on bureaucracy as an institution and bureaucrats as policy makers. We want to focus our stories especially about policies on technology, geopolitics, urban planning, climate change and the future of work. We believe that these five areas will be critical to companies and citizens over the coming years to make informed decisions and empower them with the knowledge to thrive in a rising India and fractured world.',
        'Our content is driven purely by the interest of the reader, rather than by any economic or political institution. We hope that with time we will be trusted by our readers for our accuracy, intelligence and integrity.',
        'Finally, we plan to grow in phases, step by step. But as we grow, we would like to hear from you about what you like, what you don’t and what more you would like to read and hear about.',
        'We look forward to a mutually beneficial and interactive relationship with you, dear readers.',
    ];

    editArticle() {
        return this.content;
    }
}
