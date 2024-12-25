import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Modal,
  message,
  Upload,
  Space,
  Image,
  Form,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import instance from '@/utils/request';
import { toast } from 'react-toastify';
import config from '@/config/baseurl_config';

function AttachmentManager({ draftId }) {
  // 附件列表
  const [attachments, setAttachments] = useState([]);
  // 加载状态
  const [loading, setLoading] = useState(false);

  // 预览相关状态
  const [previewVisible, setPreviewVisible] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);

  const [currentEdit,setCurrentEdit] = useState(null);

  const [previewUrl, setPreviewUrl] = useState('');
  const [currentName,setCurrentName] = useState("");


  // 1. 获取附件列表
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

  // 2. 删除附件
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await instance.delete(`/article/deleteattachmentById/${id}`);
      message.success('删除成功');
      // 重新获取列表
      fetchAttachments();
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 3. 打开预览 Modal
  const handlePreview = (record) => {
    // 假设 record.attachementUrl 可以直接访问，若需拼完整 URL，请自行拼接
    setPreviewUrl(config.baseUrl+record.attachmentUrl);
    setPreviewVisible(true);
  };

  // 4. 关闭预览
  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPreviewUrl('');
  };

  // 5. antd Upload - 上传前的校验，可限制文件大小、类型等
  const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('文件大小不能超过 5MB！');
      return Upload.LIST_IGNORE; // 阻止上传
    }
    return true;
  };

  // 6. 自定义上传逻辑
  const customUpload = async ({ file, onSuccess, onError }) => {
    // file：要上传的文件对象
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await instance.post(`/article/attachment/${draftId}`, formData
      );
      // 上传成功
      toast.success('上传成功');
      onSuccess && onSuccess(res.data, file);
      fetchAttachments();
    } catch (error) {
      toast.error('上传失败');
      onError && onError(error);
    }
  };

  const handleEdit = (record)=>{
    setCurrentEdit(record.id);
    setCurrentName(record.attachmentName)
    setEditorOpen(true)
  }

  const handleChangeFileName = async()=>{
    try{
        const response = await instance.put(`/article/attachment/${currentEdit}`,{"attachmentName":currentName});
        if(response.data.success){
            toast.success("修改成功");
            fetchAttachments();
            setEditorOpen(false);
            setCurrentEdit(null)
            setCurrentName("")
        }else{
            toast.error("修改失败");
        }
    }
    catch{
        toast.error("修改失败");
    }
  }

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

          <Button type="primary" onClick={() => handleEdit(record)}>
            编辑
          </Button>

          <Button danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>

        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h2 style={{ marginBottom: 16 }}>附件管理</h2>

      {/* 上传组件 */}
      <Upload
        name="file"
        beforeUpload={beforeUpload}
        customRequest={customUpload}
        showUploadList={false} // 不使用 antd 默认列表渲染
      >
        <Button icon={<UploadOutlined />} type="primary" style={{ marginBottom: 16 }}>
          点击上传
        </Button>
      </Upload>

      {/* 附件列表表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={attachments}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="修改附件名"
        open={editorOpen}
        onOk={()=>handleChangeFileName()}
        onCancel={()=>setEditorOpen(false)}
      >
        <Form  layout="vertical">
            <label>名称: </label>
            <input className='w-full p-2' value={currentName} onChange={(e)=>{setCurrentName(e.target.value)}}></input>
        </Form>
      </Modal>

      {/* 预览弹窗 */}
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

export default AttachmentManager;