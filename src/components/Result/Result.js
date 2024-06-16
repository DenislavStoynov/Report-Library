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
                const { reportPath } = reports[selectedReportId];
                const report = await fetchReport(reportPath);
                const paramsRequestBody = getParametersRequestBody(report);
                const { clientId } = await registerClient();

                const reportParamsResponse = await getReportParameters(clientId, paramsRequestBody);

                const instanceRequestBody = generateInstanceRequestBody(report, reportParamsResponse);
                const { instanceId } = await getReportInstanceId(clientId, instanceRequestBody);

                const documentRequestBody = getDocumentRequestBody();
                const { documentId: baseDocumentID } = await getReportDocumentId(clientId, instanceId, documentRequestBody);

                const updatedDocumentRequestBody = getDocumentRequestBodyByFormatAndDocId(selectedFormat, baseDocumentID);
                const { documentId: updatedDocumentId } = await getReportDocumentId(clientId, instanceId, updatedDocumentRequestBody);


                const { pageCount } = await getReportDocumentInfo(clientId, instanceId, baseDocumentID);

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