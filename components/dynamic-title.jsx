import Head from "next/head"
import React from "react"
const DynamicTitle = ({ title }) => {
    return (
        <>
            <Head>
                {/* <link rel="icon" href="/images/logo.svg"/> */}
                <title>{title}</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700;6..12,800;6..12,900&family=Roboto:wght@300;400;500;700;900&family=Ysabeau+Office:wght@300&display=swap"
                    rel="stylesheet"
                />
                {/* <!-- font awesome --> */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
                    crossorigin="anonymous"
                    referrerpolicy="no-referrer"
                />
                {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-W01BVB89VX"></script> */}
                {/* <script dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${Analytics});
                `}} /> */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
        </>
    )
}
export default DynamicTitle