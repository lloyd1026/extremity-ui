'use client'
import { useEffect, useState } from "react"
import { Card, Col, Row, Avatar, Typography, Modal } from "antd"
import request from "@/utils/request"
import { User } from "../info"
import config from "@/config/baseurl_config"

const { Title, Text } = Typography

interface TeamUserDetails {
  idRole: number;
  position: string;
  personalBio: string;
  researchDirection: string;
  researchOverview: string;
}
interface TeamUser {
  name:string;
  idRole: number;
  position: string;
  personalBio: string;
  researchDirection: string;
  researchOverview: string;
}
export default function Example() {
  const [users, setUsers] = useState<User[]>([])
  const [teamUsers, setTeamUsers] = useState<TeamUserDetails[]>([])
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null) // 用于存储点击的用户信息

  // Fetch users from team-admin
  const fetchUser = async () => {
    try {
      const response = await request.get(`/team-admin/get-activated-team-members`)
      if (response.data.success) {
        setUsers(response.data.data)
      }
    } catch (error) {
      console.error('获取人员数据错误', error)
    }
  }

  // Fetch team user details
  const fetchTeamUser = async () => {
    try {
      const response = await request.get(`/team-user/all`)
      if (response.data.success) {
        setTeamUsers(response.data.data)
      }
    } catch (error) {
      console.error('获取人员数据错误', error)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchUser();
    fetchTeamUser();
  }, [])

  // 点击卡片时显示详细信息
  const handleCardClick = (user1: TeamUserDetails,user2:User) => {
    const user:TeamUser ={
        name:user2.realName,
        idRole: user1.idRole,
        position: user1.position,
        personalBio: user1.personalBio,
        researchDirection: user1.researchDirection,
        researchOverview: user1.researchOverview,
    }
    setSelectedUser(user)
  }

  return (
    <div className=" py-24 sm:py-32 mx-4">
      <Row gutter={32}>
        {/* 左侧文本描述区域 */}
        <Col xs={24} lg={8}>
          <div>
            <Title level={2} style={{ fontWeight: 'bold' }}>西伯利亚泰坦巨龙</Title>
            <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#666' }}>
            我们组专注于开发和研究前沿的人工智能技术，致力于推动深度学习和计算机视觉领域的创新与应用。凭借在图像识别、目标检测、自然语言处理等多个领域的显著成果，我们在学术界和工业界均取得了广泛认可。团队成员包括来自世界顶尖学府的专家，拥有丰富的科研经验和技术背景，致力于开发具有高效性、可扩展性和应用价值的AI解决方案。
            </Text>
          </div>
        </Col>

        {/* 右侧两列用户卡片区域 */}
        <Col xs={24} lg={16}>
          <Row gutter={[32, 32]}>
            {teamUsers.map((person) => {
              const teamUser = users.find(user => user.idUser === person.idRole)

              return (
                <Col key={person.idRole} xs={24} sm={12}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} onClick={() => teamUser && handleCardClick(person,teamUser)}>
                    <Avatar
                      size={64}
                      src={config.imageUrl + teamUser?.avatarUrl}
                      alt={`${teamUser?.nickName}'s avatar`}
                    />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{teamUser?.nickName}</Title>
                      <Text style={{ color: 'blue', fontWeight: '500' }}>
                        {teamUser?.email}
                        <br />
                      </Text>
                      <Text style={{ fontWeight: '500' }}>
                        {person.position}  {/* Display the position here */}
                      </Text>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>

      {/* 显示选中的用户详情 */}
      {selectedUser && (
        <Modal
          open={true}
          onCancel={() => setSelectedUser(null)}
          footer={null}
          title={`${selectedUser.name}的详细信息`}
        >
          <div>
            <Title level={4}>个人简介</Title>
            <Text>{selectedUser.personalBio}</Text>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Title level={4}>研究方向</Title>
            <Text>{selectedUser.researchDirection}</Text>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Title level={4}>研究概述</Title>
            <Text>{selectedUser.researchOverview}</Text>
          </div>
        </Modal>
      )}
    </div>
  )
}
