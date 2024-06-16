import axios from "axios";
import { parse } from 'parse5';
import { extractReports, getDocumentInfoURL, getDocumentPageURL, getDocumentURL, getExportFormatsURL, getReportDocumentIdURL, getReportInstanceIdURL, getReportParametersURL, getReportPath, registerClientURL } from "./functions";
import { BASE_SUFFIX, BASE_URL, reportRegex } from "./consts";

export const fetchReports = async () => {
    try {
        const response = await axios.get(BASE_URL + BASE_SUFFIX);
        const htmlResponse = parse(response.data);
        const reports = [];
        extractReports(htmlResponse, reports);
        return reports;
    } catch (error) {
        console.error('Error fetching reports:', error);
        return null;
    }
};

export const fetchExportFormats = async () => {
    try {
        const response = await axios.get(getExportFormatsURL());
        return response.data;
    } catch (error) {
        console.error("Error fetching export formats", error);
        return null;
    }
};

export const fetchReport = async (reportPath) => {
    try {
        const response = await axios.get(getReportPath(reportPath));
        return response.data.match(reportRegex)[1];
    } catch (error) {
        console.error("Error fetching report", error);
        return null;
    }
};

export const registerClient = async () => {
    try {
        const response = await axios.post(registerClientURL());
        return response.data;
    } catch (error) {
        console.error("Error registering client", error);
        return null;
    }
};

export const getReportParameters = async (clientId, paramsReqBody) => {
    try {
        const response = await axios.post(getReportParametersURL(clientId), paramsReqBody);
        return response.data;
    } catch (error) {
        console.error("Error fetching report parameters", error);
        return null;
    }
};

export const getReportInstanceId = async (clientId, instanceRequestBody) => {
    try {
        const response = await axios.post(getReportInstanceIdURL(clientId), instanceRequestBody);
        return response.data;
    } catch (error) {
        console.error("Error fetching report instance", error);
        return null;
    }
};

export const getReportDocumentId = async (clientId, instanceId, documentRequestBody) => {
    try {
        const response = await axios.post(getReportDocumentIdURL(clientId, instanceId), documentRequestBody);
        return response.data;
    } catch (error) {
        console.error("Error fetching document ID", error);
        return null;
    }
};

export const getReportDocumentInfo = async (clientId, instanceId, documentId) => {
    try {
        const response = await axios.get(getDocumentInfoURL(clientId, instanceId, documentId));
        return response.data;
    } catch (error) {
        console.error("Error retrieving document info:", error);
        return;
    }
};

export const getDocument = async (clientId, instanceId, documentId) => {
    try {
        const response = await axios.get(getDocumentURL(clientId, instanceId, documentId) + '?response-content-disposition=attachment');
        return response;
    } catch (error) {
        console.error("Error fetching document", error);
        return null;
    }
};

export const getDocumentPage = async (clientId, instanceId, documentId, pageNumber) => {
    try {
        const response = await axios.get(getDocumentPageURL(clientId, instanceId, documentId, pageNumber));
        return response.data;
    } catch (error) {
        console.error("Error fetching document page", error);
        return null;
    }
};

