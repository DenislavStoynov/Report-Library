import React, { createContext, useState } from 'react';

const ReportContext = createContext();

const ReportProvider = ({ children }) => {
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [reports, setReports] = useState([]);
    const [formats, setFormats] = useState([]);
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [clientId, setClientId] = useState(null);
    const [instanceId, setInstanceId] = useState(null);
    const [documentId, setDocumentId] = useState(null);
    const [loadingPages, setLoadingPages] = useState(false);


    return (
        <ReportContext.Provider value={
            {
                reports, setReports,
                selectedReportId, setSelectedReportId,
                formats, setFormats,
                selectedFormat, setSelectedFormat,
                clientId, setClientId,
                instanceId, setInstanceId,
                documentId, setDocumentId,
                loadingPages, setLoadingPages
            }
        }
        >
            {children}
        </ReportContext.Provider>
    );
};

export { ReportContext, ReportProvider };