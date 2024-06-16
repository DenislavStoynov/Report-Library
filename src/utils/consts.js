
export const BASE_URL = 'https://demos.telerik.com';
export const BASE_SUFFIX = '/reporting';

export const excludedNodeNames = ['#documentType', 'link', 'style', 'script', '#text'];
export const steps = [
    {
        id: 1,
        title: 'Reports'
    },
    {
        id: 2,
        title: 'Export Format'
    },
    {
        id: 3,
        title: 'Result'
    }
]

// find 'report:' and returns its name
export const reportRegex = /report:\s*'([^']+)'/