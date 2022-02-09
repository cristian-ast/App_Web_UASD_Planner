import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import styled from '@emotion/styled';

const SunEditorContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: 800px;
`;

const TextEditor = ({setNewsContent, defaultData}) => {

    const handleChange = (content) => {
        setNewsContent(content);
    }

    return (
        <SunEditorContainer>
            <SunEditor 
                onChange={handleChange} 
                setDefaultStyle="font-family: sans-serif; font-size: 16px;" 
                setOptions={{height: 350}}
                placeholder="Please type here..."
                defaultValue={defaultData}
            />
        </SunEditorContainer> 
    );
};

export default TextEditor;