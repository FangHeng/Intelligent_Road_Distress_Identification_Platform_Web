import {useState} from "react";
import {Col, InputNumber, Row, Slider} from "antd";

const DecimalStep = () => {
    const [inputValue, setInputValue] = useState(0.7);
    const onChange = (value) => {
        if (isNaN(value)) {
            return;
        }
        setInputValue(value);
    };
    return (
        <Row>
            <Col span={16}>
                <Slider
                    min={0}
                    max={1}
                    onChange={onChange}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                    step={0.01}
                />
            </Col>
            <Col span={4}>
                <InputNumber
                    min={0}
                    max={1}
                    style={{
                        margin: '0 16px',
                    }}
                    step={0.01}
                    value={inputValue}
                    onChange={onChange}
                />
            </Col>
        </Row>
    );
};

export default DecimalStep;