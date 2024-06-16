import React, { useState, useEffect, useContext } from 'react';
import { ReportContext } from './contexts/ReportContext';
import Wrapper from './components/Wrapper/Wrapper';
import { fetchReports } from './utils/requests';
import Buttons from './components/Buttons/Buttons';
import Reports from './components/Reports/Reports';
import Formats from './components/Formats/Formats';
import Result from './components/Result/Result';
import StepsComponent from './components/StepsComponent/StepsComponent';

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
        <StepsComponent curStep={curStep} />
        {renderComponent(curStep)}
        <Buttons curStep={curStep} setCurStep={setCurStep} />
      </Wrapper>
    </section>
  );
}

export default App;
