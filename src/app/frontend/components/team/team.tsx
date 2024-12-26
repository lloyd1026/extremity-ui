'use client'
import { useEffect, useState } from "react"
import { Card, Col, Row, Avatar, Typography } from "antd"
import request from "@/utils/request"
import { User } from "../info"
import config from "@/config/baseurl_config"

const { Title, Text } = Typography

interface TeamUserDetails {
    idRole: number;
  position: string;
}

export default function Example() {
  const [users, setUsers] = useState<User[]>([])
  const [teamUsers, setTeamUsers] = useState<TeamUserDetails[]>([])

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

  return (
    <div className="bg-white py-24 sm:py-32">
      <Row gutter={32}>
        {/* 左侧文本描述区域 */}
        <Col xs={24} lg={8}>
          <div>
            <Title level={2} style={{ fontWeight: 'bold' }}>西伯利亚泰坦巨龙</Title>
            <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#666' }}>
            专注于开发先进的人工智能技术，尤其在深度学习和计算机视觉领域有显著成果。
            </Text>
          </div>
        </Col>

        {/* 右侧两列用户卡片区域 */}
        <Col xs={24} lg={16}>
          <Row gutter={[32, 32]}>
            {teamUsers.map((person) => {
              // Find the corresponding position in teamUsers by matching the ids
              const teamUser = users.find(user => user.idUser === person.idRole)
                
              return (
                <Col key={person.idRole} xs={24} sm={12}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
    </div>
  )
}
