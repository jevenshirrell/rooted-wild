// submit form
$(async function () {
    const configRes = await fetch('/api/v1/config')
    const configData = await configRes.json()
    
    $('#observationForm').on('submit', async (e) => {        
        e.preventDefault()
        
        $('#submitBtn').val('Uploading...')
        $('#submitBtn').prop('disabled', true)

        try {
            // check for map input since it doesn't do it natively
            if (!$("#latitude").val()) {
                throw new Error("Choose a location")
            }

            // create req object
            let observation = {
                species:$("#speciesName").val(),
                location:{
                    type:"Point",
                    coordinates:{
                        latitude:Number($("#latitude").val()),
                        longitude:Number($("#longitude").val())
                    }
                },
                time:new Date($("#date").val()),
                photos:[]
            }

            // upload image to cloudinary
            const file = $('#image')[0].files[0]
            const uploadURL = `https://api.cloudinary.com/v1_1/${configData.cloudName}/image/upload`
            
            const uploadBody = new FormData()
            uploadBody.append('file', file)
            uploadBody.append('upload_preset', configData.uploadPreset)

            try {
                const uploadRes = await fetch(uploadURL, {
                    method:'POST',
                    body:uploadBody
                })
                if (!uploadRes.ok) new Error(uploadRes.statusText)

                const data = await uploadRes.json()
                console.log(data.secure_url)
                observation.photos.push(data.secure_url)

            } catch (err) {
                console.log(err.message)
            }

            // post to API
            console.log(observation)
            const apiRes = await fetch('/api/v1/observations', {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(observation)
            })
            if (!apiRes.ok) throw new Error(apiRes)

        } catch (err) {
            $('#submitBtn').val('Submit')
            $('#submitBtn').prop('disabled', false)
            console.log(err.message)
            // alert(err.message)
        }
    })
})


// Map input
const map = L.map('map').setView([38.5283, -98.5795], 4)

let marker


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map)

function setLocation(lat, lng) {
    $('#latitude').val(lat)
    $('#longitude').val(lng)

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng], { draggable: true }).addTo(map)
        marker.on('dragend', () => {
        const pos = marker.getLatLng()
        setLocation(pos.lat, pos.lng)
        });
    }
}

// place marker
map.on('click', (e) => {
    setLocation(e.latlng.lat, e.latlng.lng)
});