import React from 'react'

function Po_status({isModalOpen, setIsModalOpen}) {
    const handleCloseModal = () => {
        setIsModalOpen(false);
      };

    return (

        <>
        {isModalOpen &&(
            <div>
            <h1>PO Status</h1>
            <p>
                1. Approved- 24th Jan 2024- Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste, nihil! Incidunt delectus iure perspiciatis. Vel nemo ab quasi numquam qui voluptatibus ex, amet quisquam, reprehenderit dolorum earum similique, repellat enim.
            </p>
            <p>
                2. Approved-27th Jan 2024 -Lorem ipsumn Lorem ipsumn Lorem ipsumn
            </p>
            </div>
            )}
        </>
    )
    }

export default Po_status;