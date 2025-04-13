import { Button, Result } from "antd";
import { Link } from "react-router";

const AccessDenied = () => (
    <Result
        status="403"
        title="Access Denied"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
            <Link to="/login">
                <Button type="primary">Back to home</Button>
            </Link>
        }
    />
);

export default AccessDenied;
