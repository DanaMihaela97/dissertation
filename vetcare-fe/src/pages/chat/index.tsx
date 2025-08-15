import React from 'react'
import Authentication from "@/components/Authentication";
import Layout from "@/components/Layout";

const Chat = () => {
    return (
        <Layout>
            <Authentication>
               <div>Trebuie sa pornesti un chat</div>
            </Authentication>
        </Layout>
    )
}

export default Chat
