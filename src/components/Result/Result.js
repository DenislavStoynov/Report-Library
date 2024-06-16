import React, { useState, useEffect, useContext } from 'react';
import { fetchReport, getDocument, getDocumentPage, getReportDocumentId, getReportDocumentInfo, getReportInstanceId, getReportParameters, registerClient } from '../../utils/requests';
import { combineReportPages, generateInstanceRequestBody, getDocumentRequestBody, getDocumentRequestBodyByFormatAndDocId, getParametersRequestBody } from '../../utils/functions';
import { ReportContext } from '../../contexts/ReportContext';


const Result = () => {
    const { reports, selectedReportId, selectedFormat, setClientId, setInstanceId, setDocumentId, loadingPages, setLoadingPages } = useContext(ReportContext);
    const [reportPages, setReportPages] = useState(null);

    useEffect(() => {
        const getReport = async () => {
            try {
                setLoadingPages(true);

                // Fetch report document and extract report name
                const { reportPath } = reports[selectedReportId];
                const report = await fetchReport(reportPath);
                
                // Generate report parameters request body and register client
                const paramsRequestBody = getParametersRequestBody(report);
                const { clientId } = await registerClient();
                
                // Use generated request parameters to get report parameters
                const reportParamsResponse = await getReportParameters(clientId, paramsRequestBody);

                // Generate instance request body, using id and value properties, and fetch report instance id
                const instanceRequestBody = generateInstanceRequestBody(report, reportParamsResponse);
                const { instanceId } = await getReportInstanceId(clientId, instanceRequestBody);

                // Fetch report document id, using HTML5Interactive type
                const documentRequestBody = getDocumentRequestBody();
                const { documentId: baseDocumentID } = await getReportDocumentId(clientId, instanceId, documentRequestBody);

                // Update document request body to use selected export format and initial document id
                const updatedDocumentRequestBody = getDocumentRequestBodyByFormatAndDocId(selectedFormat, baseDocumentID);
                const { documentId: updatedDocumentId } = await getReportDocumentId(clientId, instanceId, updatedDocumentRequestBody);

                // Fetch report document info
                const { pageCount } = await getReportDocumentInfo(clientId, instanceId, baseDocumentID);

                // Combine page styles and content
                const combinedReportPages = await combineReportPages(clientId, instanceId, baseDocumentID, pageCount);

                setReportPages(combinedReportPages);
                setClientId(clientId);
                setInstanceId(instanceId);
                setDocumentId(updatedDocumentId);

                setLoadingPages(false);
            } catch (error) {
                setLoadingPages(false);
                console.error("Error rendering report", error);
                alert("Error rendering report");
            }
        }

        if (selectedFormat) getReport();

    }, []);

    return (
        <div className='report'>
            {!selectedFormat && <h3>Please select export format to get your report</h3>}
            {loadingPages && <p>Loading report...</p>}
            {reportPages && <div
                dangerouslySetInnerHTML={{ __html: reportPages }}
            />}
        </div>
    )
};

export default Result;