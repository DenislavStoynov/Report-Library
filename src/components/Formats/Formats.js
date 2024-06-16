import React, { useEffect, useContext } from 'react';
import { Select } from 'antd';
import { fetchExportFormats } from '../../utils/requests';
import { ReportContext } from '../../contexts/ReportContext';

const { Option } = Select;

const Formats = () => {
    const { formats, setFormats, selectedFormat, setSelectedFormat } = useContext(ReportContext);

    useEffect(() => {
        if (formats && formats.length === 0) getFormats();
    }, []);

    const getFormats = async () => {
        try {
            const fetchedFormats = await fetchExportFormats();
            setFormats(fetchedFormats);
        } catch (error) {
            console.error('Error fetching formats:', error);
            alert('Error fetching formats');
        }
    }

    const extractFormats = () => {
        return formats.map((format, id) => (
            <Option key={id} value={format.name}>{format.name}</Option>
        ))
    };

    const handleFormatSelection = (value) => {
        if (selectedFormat !== value) setSelectedFormat(value);
    };

    if (!formats.length) return <p>Loading formats...</p>;
    if (!formats) return <p>Something went wrong while processing the formats! Please refresh your page!</p>;
    return (
        <Select value={!selectedFormat ? "Select export format" : selectedFormat} style={{ width: '100%', height: 50 }} onChange={handleFormatSelection}>
            {extractFormats()}
        </Select>
    );

}

export default Formats;