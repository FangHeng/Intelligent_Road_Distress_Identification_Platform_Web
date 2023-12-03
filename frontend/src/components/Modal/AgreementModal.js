import React, { useState } from 'react';
import { Modal, Checkbox } from 'antd';

const AgreementModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Checkbox>
                我已阅读 <a onClick={showModal}>协议</a>
            </Checkbox>
            <Modal title="协议内容" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {/* 这里填入您的协议内容 */}
                <p>这里是协议内容...</p>
            </Modal>
        </>
    );
};

export default AgreementModal;