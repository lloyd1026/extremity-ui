import instance from "./request";
const getuser = () => {
    return instance.get("/auth/user");
};
export default getuser;