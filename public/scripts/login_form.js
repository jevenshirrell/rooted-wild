$(async function() {
    // check if logged in
    if (localStorage.getItem("rootedWildToken")) {
        fetch('/api/v1/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("rootedWildToken")}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                window.location.href = "/"
            }
        })
    }

    $('#authForm').on('submit', async (e) => {        
        e.preventDefault()
        
        $('#submitBtn').prop('disabled', true)

        try {
            // create req object
            let user = {
                email:$('#email').val(),
                password:$('#pwd').val()
            }
            
            // post to API
            const apiRes = await fetch('/api/v1/auth/login', {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            if (!apiRes.ok) throw new Error(JSON.stringify(await apiRes.json()))

            data = await apiRes.json()
            localStorage.setItem("rootedWildToken", data.data.token)
            window.location.href = "/"
        } catch (err) {
            $('#submitBtn').prop('disabled', false)
            console.log(err.message)
            // alert(err.message)
        }
    })
})