import React, { useEffect, useContext } from 'react';
import { Card, Row, Col } from "antd";
import { ReportContext } from '../../contexts/ReportContext';
import { fetchReports } from '../../utils/requests';


const Reports = () => {
    const { reports, selectedReportId, setSelectedReportId, setReports } = useContext(ReportContext);
    const handleReportSelection = (index) => {
        if (selectedReportId !== index) setSelectedReportId(index);
    };
    const extractReportCards = () => {
        return reports.map((report, index) => (
            <Col key={report.id} span={12}>
                <Card
                    onClick={() => handleReportSelection(index)}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: selectedReportId === index ? '#e6f7ff' : '#fff',
                        borderColor: selectedReportId === index ? '#1890ff' : '#d9d9d9',
                    }}
                >
                    {report.reportName}
                </Card>
            </Col>
        ))
    };

    useEffect(() => {
        const getReports = async () => {
          try {
            const fetchedReports = await fetchReports()
            setReports(fetchedReports);
          } catch (error) {
            console.error('Error fetching reports:', error);
            alert('Error fetching reports');
          }
        };
    
        getReports();
      }, []);

    if (!reports.length) return <p>Loading reports...</p>;
    if (!reports) return <p>Something went wrong while processing the reports! Please try again!</p>;
    return (
        <Row gutter={[16, 16]}>
            {extractReportCards()}
        </Row>
    );
}

export default Reports;