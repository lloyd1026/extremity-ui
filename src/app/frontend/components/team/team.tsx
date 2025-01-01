'use client'
import { useEffect, useState } from "react"
import { Card, Col, Row, Avatar, Typography, Modal } from "antd"
import request from "@/utils/request"
import { User } from "../info"
import config from "@/config/baseurl_config"

const { Title, Text } = Typography

interface TeamInfo {
  teamId: number;
  teamName: string;
  description: string;
  researchField: string;
}

interface TeamUserDetails {
  userId: number;
  position: string;
  personalBio: string;
  researchDirection: string;
  researchOverview: string;
}
interface TeamUser {
  name:string;
  userId: number;
  position: string;
  personalBio: string;
  researchDirection: string;
  researchOverview: string;
}
export default function Example() {
  const [users, setUsers] = useState<User[]>([])
  const [teamUsers, setTeamUsers] = useState<TeamUserDetails[]>([])
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null) // 用于存储点击的用户信息

  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null); // 团队信息
  const [isLoading, setLoading] = useState(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息

  // Fetch users from team-admin
  const fetchUser = async () => {
    try {
      const response = await request.get(`/user/get-activated-team-members`)
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

  // Fetch team information
  const fetchTeamInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.get(`/user/show-info`, {
        params: { teamId: "1" },
      });
      if (response.data.success) {
        setTeamInfo(response.data.data);
      } else {
        setError("获取团队信息失败");
      }
    } catch (err) {
      console.error(err);
      setError("无法加载团队信息");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUser();
    fetchTeamUser();
    fetchTeamInfo();
  }, [])

  // 点击卡片时显示详细信息
  const handleCardClick = (user1: TeamUserDetails,user2:User) => {
    const user:TeamUser ={
        name:user2.realName,
        userId: user1.userId,
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
            <Title level={2} style={{ fontWeight: 'bold' }}>{teamInfo?.teamName}</Title>
            <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#666' }}>
            {teamInfo?.description}
            </Text>
          </div>
        </Col>
        

        {/* 右侧两列用户卡片区域 */}
        <Col xs={24} lg={16}>
          <Row gutter={[32, 32]}>
            {teamUsers.map((person) => {
              const teamUser = users.find(user => user.idUser === person.userId)

              return (
                <Col key={person.userId} xs={24} sm={12}>
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
