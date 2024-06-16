import { BASE_SUFFIX, BASE_URL, excludedNodeNames } from "./consts";
import { getDocumentPage } from "./requests";
import axios from "axios";

export const extractReports = (node, reports) => {
    if (
        node.nodeName === 'a' &&
        node.hasOwnProperty('attrs') &&
        node.attrs.length >= 2 &&
        !node.attrs.some(attr => attr.value.includes('Web Report Designer')) &&
        node.parentNode.attrs.find(attribute => attribute.value.includes('accordion-inner'))
    ) {
        const attributes = node.attrs;
        const reportName = removeRunAndDemoToGetReportName(attributes.find(attr => attr.name === 'title').value);
        const reportPath = attributes.find(attr => attr.name === 'href').value;
        reports.push({ id: Math.random(), reportName, reportPath });
    }

    if (!excludedNodeNames.includes(node.nodeName) && node.childNodes) {
        for (const childNode of node.childNodes) {
            extractReports(childNode, reports);
        }
    }
};

export const removeRunAndDemoToGetReportName = (reportName) => {
    // Split the string by whitespace
    const words = reportName.trim().split(/\s+/);
    // Remove the first and last word
    const updatedWords = words.slice(1, -1);

    return updatedWords.join(' ');
};

export const generateInstanceRequestBody = (report, reportParamsResponse) => {
    const instanceRequestBody = { report };
    if (Array.isArray(reportParamsResponse)) {
        if (!reportParamsResponse.length) instanceRequestBody.parameterValues = {};
        else {
            for (const el of reportParamsResponse) {
                instanceRequestBody.parameterValues = { ...instanceRequestBody.parameterValues, [el.id]: el.value };
            }
        }
    } else {
        instanceRequestBody.parameterValues = { [reportParamsResponse.id]: reportParamsResponse.value };
    }
    return instanceRequestBody;
};

export const getDocumentRequestBody = () => {
    return {
        "format": "HTML5Interactive",
        "deviceInfo": {
            "enableSearch": true,
            "ContentOnly": true,
            "UseSVG": true,
            "BasePath": "/reporting/api/reports"
        },
        "useCache": true
    }
};

export const getDocumentRequestBodyByFormatAndDocId = (format, baseDocumentID) => {
    return {
        format,
        "deviceInfo": {
            "enableSearch": true,
            "BasePath": "/reporting/api/reports"
        },
        "useCache": true,
        baseDocumentID
    }
};

export const prependTelerikURLToImageSrc = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');

    images.forEach((img) => {
        const currentSrc = img.getAttribute('src');
        if (currentSrc && !currentSrc.startsWith('https://demos.telerik.com/')) {
            img.setAttribute('src', `https://demos.telerik.com/${currentSrc}`);
        }
    });

    return doc.documentElement.innerHTML;
};

export const combineReportPages = async (clientId, instanceId, baseDocumentID, pageCount) => {
    let combinedHtmlResult = '';

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
        const { pageContent, pageStyles } = await getDocumentPage(clientId, instanceId, baseDocumentID, pageNumber);
        const modifiedPageContent = prependTelerikURLToImageSrc(pageContent);
        const pageHtml = `<style>${pageStyles}</style>${modifiedPageContent}`;
        combinedHtmlResult += pageHtml;
    }
    return combinedHtmlResult;
}

export const downloadReportDocument = async (clientId, instanceId, documentId, selectedFormat) => {
    if (!selectedFormat) return;

    try {
        const response = await axios.get(getDocumentURL(clientId, instanceId, documentId));
        if (response.status === 200) {
            const form = document.createElement('form');
            form.action = getDocumentURL(clientId, instanceId, documentId);
            form.method = 'GET';
            form.style.display = 'none';
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    } catch (error) {
        console.error("Error downloading report:", error);
        alert('Unsupported export format');
    }
};

export const getParametersRequestBody = (report) => {
    return { parameterValues: {}, report };
};

export const getExportFormatsURL = () => {
    return BASE_URL + BASE_SUFFIX + '/api/reports/formats';
};

export const getReportPath = (reportPath) => {
    return BASE_URL + reportPath;
};

export const registerClientURL = () => {
    return BASE_URL + BASE_SUFFIX + '/api/reports/clients';
};

export const getReportParametersURL = (clientId) => {
    return registerClientURL() + `/${clientId}/parameters`;
};

export const getReportInstanceIdURL = (clientId) => {
    return registerClientURL() + `/${clientId}/instances`;
};

export const getReportDocumentIdURL = (clientId, instanceId) => {
    return getReportInstanceIdURL(clientId) + `/${instanceId}/documents`;
};

export const getDocumentURL = (clientId, instanceId, documentId) => {
    return getReportDocumentIdURL(clientId, instanceId) + `/${documentId}`;
};

export const getDocumentInfoURL = (clientId, instanceId, documentId) => {
    return getDocumentURL(clientId, instanceId, documentId) + `/info`;
};

export const getDocumentPageURL = (clientId, instanceId, documentId, pageNumber) => {
    return getDocumentURL(clientId, instanceId, documentId) + `/pages/${pageNumber}`;
};