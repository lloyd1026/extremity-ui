import instance from "./request";
const getuserwithRoles = () => {
    return instance.get("/auth/user");
};
export default getuserwithRoles;