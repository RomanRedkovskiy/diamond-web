import {baseConfig} from './baseConfig.js';

const apiUrl = baseConfig.apiBaseUrl;

export const ENDPOINTS = {
    PROJECT: 'project',
    LOG: 'log',
    INTEREST_LOG: 'interest-log',
    USER: 'user',
    GRAPHQL: 'graphql'
};

function addApiBaseUrl(item) {
    Object.keys(item).forEach((key) => {
        if (typeof item[key] === 'object') {
            addApiBaseUrl(item[key], apiUrl);
        } else {
            item[key] = apiUrl + item[key];
        }
    });
}


addApiBaseUrl(ENDPOINTS);