document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const musicList = document.getElementById('musicList');
    const musicDetails = document.getElementById('musicDetails');
    let currentAudio = null;

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchMusic(query);
        }
    });

    async function fetchMusic(query) {
        const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '7d65795fd7msh6b544a127beb235p1d8a34jsn9ba0684fca91',
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            displayMusicList(result.data);
        } catch (error) {
            console.error('Error fetching music data:', error);
        }
    }

    function displayMusicList(musicArray) {
        musicList.innerHTML = '';
        musicArray.forEach(music => {
            const musicItem = document.createElement('div');
            musicItem.classList.add('music-item');
            musicItem.innerHTML = `
                <img src="${music.album.cover_medium}" alt="${music.title}">
                <h2>${music.title}</h2>
                <p>${music.artist.name}</p>
                <p>${music.release_date}</p>
            `;
            
            // Create an audio element for each music item
            const audio = new Audio(music.preview);
            audio.preload = 'none'; // Don't preload until clicked
            musicItem.appendChild(audio);

            musicItem.addEventListener('click', () => {
                // Stop currently playing audio, if any
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                // Toggle play/pause for the clicked audio
                if (audio.paused) {
                    audio.play();
                    currentAudio = audio;
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                    currentAudio = null;
                }
            });

            musicList.appendChild(musicItem);
        });
    }

    function displayMusicDetails(music) {
        musicDetails.innerHTML = `
            <img src="${music.album.cover_medium}" alt="${music.title}">
            <h2>${music.title}</h2>
            <p>Artist: ${music.artist.name}</p>
            <p>Album: ${music.album.title}</p>
            <p>Release Date: ${music.release_date}</p>
            <p>Duration: ${Math.floor(music.duration / 60)}:${(music.duration % 60).toString().padStart(2, '0')}</p>
        `;

        // Create an audio player for the details view
        const audio = new Audio(music.preview);
        audio.controls = true;
        audio.style.width = '100%';
        musicDetails.appendChild(audio);
        
        musicDetails.style.display = 'block';
    }
});
