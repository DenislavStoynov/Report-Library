import React, { useContext } from 'react';
import { Button, Row, Col } from 'antd';
import { ReportContext } from '../../contexts/ReportContext';
import { downloadReportDocument } from '../../utils/functions';


const Buttons = ({ curStep, setCurStep }) => {
    const { selectedReportId, clientId, instanceId, documentId, loadingPages, selectedFormat } = useContext(ReportContext);

    const handlePrevStep = () => setCurStep(step => step - 1);

    const handleNextStep = () => setCurStep(step => step + 1);

    const handleNextStepOrReportDownloading = () => {
        if (curStep < 2) { handleNextStep(); return; }
        downloadReportDocument(clientId, instanceId, documentId, selectedFormat)
    };

    return (
        <Row justify={curStep === 0 ? 'end' : 'space-between'} style={{ marginTop: 16 }}>
            {curStep > 0 && <Col>
                <Button type={"primary"} disabled={curStep === 0} onClick={handlePrevStep}>
                    Back
                </Button>
            </Col>}
            <Col>
                <Button type={"primary"} disabled={typeof selectedReportId !== 'number' || loadingPages || (curStep === 2 && !selectedFormat)} onClick={handleNextStepOrReportDownloading}>
                    {curStep < 2 ? 'Next' : 'Download Report'}
                </Button>
            </Col>
        </Row >
    )
};

export default Buttons;