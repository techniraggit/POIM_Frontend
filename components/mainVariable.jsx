import { base_url } from "./constant";
export async function getServerSideProps() {
    // const CustomerToken = process.env.REACT_APP_CUSTOMER_TOKEN || '';
    return {
      props: {
        base_url,
        // CustomerToken,
      },
    };
  
  }