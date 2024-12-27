import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  message,
  Space,
  Modal,
} from 'antd';
import instance from '@/utils/request';
import config from '@/config/baseurl_config';
import Image from 'next/image';
function AttachmentShower({ draftId }) { // 添加 canModify prop，默认值为 true
  // 附件列表
  const [attachments, setAttachments] = useState([]);
  // 加载状态
  const [loading, setLoading] = useState(false);

  // 预览相关状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const res = await instance.get(`/article/attachment/${draftId}`);
      // 假设后端返回的格式形如 { code: 200, data: [...], message: 'xxx' }
      setAttachments(res?.data?.data || []);
    } catch (error) {
      message.error(`获取附件列表失败：${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (draftId) {
      fetchAttachments();
    }
  }, [draftId]);

  const handlePreview = (record) => {
    // 假设 record.attachementUrl 可以直接访问，若需拼完整 URL，请自行拼接
    setPreviewUrl(config.baseUrl + record.attachmentUrl);
    setPreviewVisible(true);
  };

  // 4. 关闭预览
  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPreviewUrl('');
  };


  // 7. 表格列定义
  const columns = [
    {
      title: '附件名称',
      dataIndex: 'attachmentName',
      key: 'id',
      width: '25%',
    },
    {
      title: '附件路径',
      dataIndex: 'attachmentUrl',
      key: 'attachmentUrl',
      width: '45%',
      ellipsis: true, // 显示省略号
    },
    {
      title: '操作',
      key: 'action',
      width: '30%',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handlePreview(record)}>
            预览
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h2 style={{ marginBottom: 16 }}>附件</h2>
      {/* 附件列表表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={attachments}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
        <Modal
        title="附件预览"
        open={previewVisible}
        footer={null}
        onCancel={handleClosePreview}
        width="80%"
        style={{ minHeight: '60vh' }}
      >
        {previewUrl ? (
          // 简单判断文件是否是图片
          previewUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <div style={{ textAlign: 'center' }}>
              <Image src={previewUrl} alt="preview" />
            </div>
          ) : (
            // 如果不是图片，可用 iframe 或第三方组件预览
            <iframe
              title="file-preview"
              src={previewUrl}
              style={{ width: '100%', height: '60vh', border: 'none' }}
            />
          )
        ) : (
          <p>暂无可预览文件</p>
        )}
      </Modal>
    </div>
  );
}
export default AttachmentShower;