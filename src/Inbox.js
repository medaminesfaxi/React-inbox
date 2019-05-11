import React from 'react'
import { Table, Layout, Menu, Icon, Modal } from 'antd';
import { dataSource, columns } from './dataSource';

const { Content, Sider } = Layout;
const menu_style = { height: "100vh" }
const btn = { color: "#40A9FF", cursor: "pointer" }

class Inbox extends React.Component {
    state = {
        trash: [],
        emails: [],
        modal: { visible: false, text: "", title: "" },
        currentTab: "emails",
    }
    componentWillMount() {
        for (let index = 0; index < dataSource.length; index++) {
            const element = dataSource[index];
            if (element.deleted === true)
                this.state.trash.push(element);
            else
                this.state.emails.push(element);
        }
        const deleteCol = {
            title: 'Delete',
            key: 'delete',
            render: (text, record) => (<span style={btn} onClick={() => this.handleDelete(record)}>Delete</span>)
        }
        const readCol = {
            title: 'Read more',
            key: 'read',
            render: (text, record) => (<span style={btn} onClick={() => this.showModal(record)}>Read more</span>)
        }
        const seenCol = {
            title: 'Seen ?',
            key: 'Seen',
            render: (text, record) => (<Icon type={record.seen ? "eye" : "eye-invisible"} style={record.seen ? { color: "#52C41A" } : { color: "#FAAD14" }} />)
        }
        columns.push(seenCol, readCol, deleteCol);
    }
    handleDelete = (record) => {
        if (record.deleted)
            this.setState({ trash: this.state.trash.filter(item => item.key !== record.key) });
        else {
            record.deleted = true;
            this.setState({ emails: this.state.emails.filter(item => item.key !== record.key) });
            this.setState({ trash: [...this.state.trash, record] })
        }
    }
    showModal(record) {
        record.seen = true;
        this.setState({ modal: { visible: true, text: record.text, title: "from : " + record.email } });
    }
    render() {
        return (
            <Layout>
                <Sider>
                    <Menu defaultSelectedKeys={['1']} style={menu_style}>
                        <Menu.Item key="1" onClick={() => this.setState({ currentTab: "emails" })}>
                            <Icon type="mail" />
                            <span className="nav-text">MailBox ( {this.state.emails.length} )</span>
                        </Menu.Item>
                        <Menu.Item key="2" onClick={() => this.setState({ currentTab: "trash" })}>
                            <Icon type="delete" />
                            <span className="nav-text">Trash ( {this.state.trash.length} )</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ backgroundColor: "#fff", paddingRight: "8px" }}>
                        <Modal
                            title={this.state.modal.title}
                            visible={this.state.modal.visible}
                            onCancel={() => this.setState({ modal: { visible: false } })}
                            footer={null}
                        >
                            <p>{this.state.modal.text}</p>
                        </Modal>
                        <Table dataSource={this.state.currentTab === "emails" ? this.state.emails : this.state.trash} columns={columns} />
                    </Content>
                </Layout>
            </Layout >
        );
    }
}
export default Inbox;