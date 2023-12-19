export async function getServerSideProps() {
    const base_url = process.env.REACT_APP_BASE_URL || '';
    // const CustomerToken = process.env.REACT_APP_CUSTOMER_TOKEN || '';
    return {
      props: {
        base_url,
        // CustomerToken,
      },
    };
  
  }