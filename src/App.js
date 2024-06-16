import React, { useState, useEffect, useContext } from 'react';
import { ReportContext } from './contexts/ReportContext';
import { Steps } from 'antd';
import Wrapper from './components/Wrapper/Wrapper';
import { fetchReports } from './utils/requests';
import { steps } from './utils/consts';
import Buttons from './components/Buttons/Buttons';
import Reports from './components/Reports/Reports';
import Formats from './components/Formats/Formats';
import Result from './components/Result/Result';

const { Step } = Steps;

const renderComponent = (curStep) => {
  switch (curStep) {
    case 0:
      return <Reports />
    case 1:
      return <Formats />
    case 2:
      return <Result />
    default:
      return null;
  }
}

function App() {
  const [curStep, setCurStep] = useState(0);
  const { setReports } = useContext(ReportContext);

  const extractSteps = () => {
    return steps.map(step => <Step key={step.id} title={step.title} />)
  };

  useEffect(() => {
    const getReports = async () => {
      try {
        const fetchedReports = await fetchReports();
        setReports(fetchedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        alert('Error fetching reports');
      }
    };

    getReports();
  }, []);

  return (
      <section className="App">
        <Wrapper>
          <Steps current={curStep} style={{ marginBottom: 16 }}>
            {extractSteps()}
          </Steps>
          {renderComponent(curStep)}
          <Buttons curStep={curStep} setCurStep={setCurStep} />
        </Wrapper>
      </section>
  );
}

export default App;
