'use client'

import request from "@/utils/request"
import { useEffect } from "react"

const Team = () =>{

    const fetchTeam=async()=>{
        try {
            const response = await request.get(`/team-admin/show-info`,{params:{teamId:1}})
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        fetchTeam();
    },[])
    return(<div>

    </div>)
}

export default Team;