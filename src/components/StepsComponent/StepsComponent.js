import React, { useCallback } from 'react';
import { Steps } from 'antd';
import { steps } from '../../utils/consts';
const { Step } = Steps;

// Memoize step component, not necessary to re-render as its constant

const StepsComponent = React.memo(({ curStep }) => {
    const extractSteps = useCallback(() => {
        return steps.map(step => <Step key={step.id} title={step.title} />);
    }, []);

    return (
        <Steps current={curStep} style={{ marginBottom: 16 }}>
            {extractSteps()}
        </Steps>
    );
});

export default StepsComponent;