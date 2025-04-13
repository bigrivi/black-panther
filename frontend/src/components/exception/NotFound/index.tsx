import { Button, Result } from "antd";
import { Link } from "react-router";

export default () => (
    <Result
        status="404"
        title="Not Found"
        subTitle="Requested resource is not available"
        extra={
            <Link to="/">
                <Button type="primary">Back Home</Button>
            </Link>
        }
    />
);
