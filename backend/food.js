import axios from 'axios';
import { useEffect } from 'react';

const foodData = {
    foodItems: [
        {
            "id": 180,
            "name": "Butter Chicken",
            "price": 300,
            "image": "https://media.istockphoto.com/id/618457124/photo/butter-chicken-served-with-homemade-indian-naan-bread.jpg?s=612x612&w=0&k=20&c=7FoiHoDtocfPvQIaRFfFani4e5lkfMTNl_619rTTh4g=",
            "category": "Non-veg",
            "status": 200
        },
        {
            "id": 133,
            "name": "Paneer Tikka",
            "price": 250,
            "image": "https://images.pexels.com/photos/8414639/pexels-photo-8414639.jpeg?auto=compress&cs=tinysrgb&w=600",
            "category": "Veg",
            "status": 200
        },
        {
            "id": 134,
            "name": "Biryani",
            "price": 180,
            "image": "https://images.pexels.com/photos/15058974/pexels-photo-15058974/free-photo-of-a-bowl-of-rice-with-tomatoes-and-yogurt.jpeg?auto=compress&cs=tinysrgb&w=600",
            "category": "Veg",
            "status": 200
        },
        {
            "id": 135,
            "name": "Samosa",
            "price": 40,
            "image": "https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=600",
            "category": "Veg",
            "status": 200
        },
        {
            "id": 1,
            "name": "Matar Paneer",
            "price": 200,
            "image": "https://t4.ftcdn.net/jpg/11/01/44/41/240_F_1101444116_4SdhAYJIfm43TJKznTOSWwbAwHscgwuA.jpg",
            "category": "Veg",
            "status": true
        },
        {
            "id": 2,
            "name": "Chicken fry",
            "price": 250,
            "image": "https://imgs.search.brave.com/o8QVtNJHR4YI5VXTFgF87_MuMgjT1bh_RUBPNgE9BEE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE4/LzA3L2NoaWNrZW4t/ZnJ5LndlYnA",
            "status": 200,
           "category":"Non-veg"
        },
        {
            "id": 3,
            "name": "Mutton Biryani",
            "price": 320,
            "image": "https://images.pexels.com/photos/14731635/pexels-photo-14731635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "status": 200,
            "category":"Non-veg"
            
        },
        {
            "id": 4,
            "name": "Chicken Biryani",
            "price": 280,
            "image": "https://imgs.search.brave.com/E2KDxdKjDtn_Jl85ZVXnScBZ4olTAxzsN-GIwnYSiO8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMw/NTQ1MTg2NC9waG90/by9iaXJ5YW5pLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1t/eVMyM3ZKTHR4cEhw/M0xTUm0wTlUzclUz/MHM4YUxiNDVVSHM4/bWZZOEtBPQ",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 5,
            "name": "Tandoori Chicken",
            "price": 180,
            "image":"https://imgs.search.brave.com/oeR3D_on6dLVfcELjTKE3VdCLboBAEHUE-BHfz1M_tE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzM5LzMwLzE4/LzM2MF9GXzEzOTMw/MTgxOV9JcDFXTUlI/TGM2dnRGamtYTmt1/aGlWdzNGcWFYVVp5/ZC5qcGc",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 6,
            "name": "Mutton Masala",
            "price": 200,
            "image": "https://imgs.search.brave.com/ldw8agTphFvfEHrzqbduy5_fsvAXNOREJ0RM8yliI_0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly95dW1t/eWluZGlhbmtpdGNo/ZW4uY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDE1LzEwL211/dHRvbi1tYXNhbGEu/anBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 7,
            "name": "Egg Curry",
            "price": 80,
            "image": "https://imgs.search.brave.com/vVSJ-X6GlMvNnlzfODum4AmL7OnZRHR5ZNBXDzKaGpU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5jaGVmZGVob21l/LmNvbS83NDAvMC8w/L2VnZ2N1cnJ5L21h/aW4xLmpwZw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 8,
            "name": "Burji",
            "price": 60,
            "image": "https://imgs.search.brave.com/URrYFJ7hwzEtbIAtU_LNISTq61VfOqWWPC4RWjDGNVQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzAxL2VnZy1iaHVy/amkud2VicA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 9,
            "name": "Chicken handi",
            "price": 220,
            "image": "https://imgs.search.brave.com/cp-kUCW4YQ4G7UMYmcFmueeYAJSt4_PtmFIe77PQEw8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vo/YjVyMjZVNHJCcVVi/WjByZVRyNEU1LWZ6/VWJPWUd4b0ljUkFW/ellrRmZIMTZWWEpz/bHZJSVE5TklkcG8w/RVdxS0JkZmtETGZt/Rzh0bnhBRUxuNzVw/V1dmMW9DdFhnekN4/VmxOY0hONlhhcDFI/WV93Y0pld19WVERn/YjlnZlR1Tk1vTnRs/Y1plckNqYkEvczY0/MC9EU0NfNzgxNy0w/MDEuSlBH",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 10,
            "name": "Rost Chicken with green sause",
            "price": 150,
            "image": "https://imgs.search.brave.com/qaqm0qyO-zPwcyG58nQ9E0WbcNbgRNWfXEcwkjJDb-k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9lYXN5/Y2hpY2tlbnJlY2lw/ZXMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzA2L3Bl/cnV2aWFuLWNoaWNr/ZW4tZ3JlZW4tc2F1/Y2UtMi1vZi03LWVk/aXRlZC5qcGc",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 11,
            "name": "Grilled chicken kabobs",
            "price": 250,
            "image": "https://imgs.search.brave.com/3ycQ9ssu8DOQvoJtJGcRIibVdaKGLPIfcxB4ZsvsZlU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9naW1t/ZXNvbWVvdmVuLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAx/OS8wNS9UaGUtSnVp/Y2llc3QtQ2hpY2tl/bi1LYWJvYnMtUmVj/aXBlLTQuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 12,
            "name": "Chicken chili",
            "price": 240,
            "image": "https://imgs.search.brave.com/WXLKDc5sn3tmvxlh2emYsnB0Zl9JTW62iqZBJaSqlOA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzEyL2NoaWxsaS1j/aGlja2VuLndlYnA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 13,
            "name": "Chicken curry",
            "price": 150,
            "image": "https://imgs.search.brave.com/eydkewjT-RuhWcVExNo4mnduyHUKZbHqtfi1M0-3iTQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIx/LzA3L2luZGlhbi1j/aGlja2VuLWN1cnJ5/LndlYnA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 14,
            "name": "Mutton curry",
            "price": 160,
            "image": "https://imgs.search.brave.com/v6SLS5sjBMGgUh-q4jXGvEtxcEFuMoX4-im-3JBXtGg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE2/LzA1L211dHRvbi1j/dXJyeS0xLndlYnA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 15,
            "name": "Fish Pakora",
            "price": 80,
            "image": "https://imgs.search.brave.com/P8zKfhZodQ7B5eYycmluMZTILqo6SP9DaXCqi6ivnVQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9lYXRh/bm1vbC5jb20vd3At/Y29udGVudC91cGxv/YWRzL0Zpc2gtUGFr/b3JhLXNjYWxlZC0x/LmpwZw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 16,
            "name": "Chicken tikka masala",
            "price": 200,
            "image": "https://imgs.search.brave.com/QgKvGXhPFy3jnxUokQU5H62l96CqhBgA-GgfSnkKhs0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIy/LzA2L2NoaWNrZW4t/dGlra2EtbWFzYWxh/LXJlY2lwZS53ZWJw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 17,
            "name": "Chicken 65",
            "price": 200,
            "image": "https://imgs.search.brave.com/e3Kr6vVacgiMO7Y0n9ch108eGqPJnKcO9549A-UoJTo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9k/L2Q3L0NoaWNrZW5f/NjUuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 18,
            "name": "Chicken Dum biryani",
            "price": 140,
            "image": "https://imgs.search.brave.com/P0_bjCi3LA-h65BdR6unASQZoRLUDu8ZU4YlKy0TwRw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDEy/LzEwL2NoaWNrZW4t/ZHVtLWJpcnlhbmku/d2VicA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 19,
            "name": "Shawarma",
            "price": 75,
            "image": "https://imgs.search.brave.com/9fyz3S-svzxGs1VKXEJ2dY3o7OuSfI2Z2k03wL3-BZM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzMzLzYzLzky/LzM2MF9GXzkzMzYz/OTI5NF9hekx0WmtI/QUxoWlBhWGxZMTNR/NnNWYTZFYkE1VGdj/dC5qcGc",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 20,
            "name": "Chettinad Biryani",
            "price": 185,
            "image": "https://imgs.search.brave.com/b5be-SsUu5MUZV0s6msRRMahwqqsO__1emJiTziwJ68/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vY29va2lu/Z2Zyb21oZWFydC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTYvMDUvY2hldHRp/bmFkLWJpcnlhbmkt/Mi5qcGc_dz03MjAm/c3NsPTE",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 21,
            "name": "Chicken Burger",
            "price": 65,
            "image": "https://imgs.search.brave.com/EKcDTAxGbVOrRob-n39JLYaW8oJ6pRWvYAotJP_x1nE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcy/NDQ5NDYxL3Bob3Rv/L2NoaWNrZW4tYnVy/Z2VyLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1oeGI3WXI3/WnRHYmZKR2VIV01N/QkZsLVZkaURvWmRL/ZDdUZVpIajN3RkVz/PQ",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 22,
            "name": "Reshmi Kabab",
            "price": 330,
            "image": "https://imgs.search.brave.com/RNfTt2kBbxnBeXoO1PLPWC2k8ZU5XSHzSP_AuLvLlW0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzI4LzA5LzY4/LzM2MF9GXzIyODA5/Njg2MV9kSE95SU1r/Y0pScG1RZXVxV2pv/dk8xTjEzeW9FMnR2/Vy5qcGc",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 23,
            "name": "Mutton Fried Rice",
            "price": 175,
            "image": "https://imgs.search.brave.com/SJtm40Qql7LZj3ExC7PSHS7afQ1ZBSQp2UdM_eNfj84/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/d2hpc2thZmZhaXIu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIxLzExL011dHRv/blB1bGFvX1N0ZXAx/NS0xMjAweDgwMC5q/cGc",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 24,
            "name": "Chicken keema",
            "price": 110,
            "image": "https://imgs.search.brave.com/gdlVsrNMjUB8Ge2XVpwvA9J_FhIte1cjWDiGH-oFhYQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hcm9t/YXRpY2Vzc2VuY2Uu/Y28vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMTEvY2hpY2tl/bi1rZWVtYS1tYXNh/bGEtMS03NzN4MTAy/NC5qcGc",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 25,
            "name": "Mutton Keema",
            "price": 145,
            "image": "https://imgs.search.brave.com/qU7r2XBNPgYIU9tUiU6W9EqXwCkMMfZnVb0ipsvOp74/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE4/LzA4L211dHRvbi1r/ZWVtYS1yZWNpcGUu/d2VicA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 26,
            "name": "Chicken Lollipop",
            "price": 120,
            "image": "https://imgs.search.brave.com/H5muw27KqaU2cCH3t1KS8SCQ6enWY2JIwzLUKQV-VSs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMz/NjczMjA5MC9waG90/by9jaGlja2VuLWxv/bGxpcG9wcy5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9SlV3/MTFzNjRyNHRwZGZx/MUt5UG52U2VnaTNa/YXJYQTRCUEtDaW15/UHlRYz0",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 27,
            "name": "Chicken majestic",
            "price": 320,
            "image": "https://imgs.search.brave.com/_tBnbJ8xw3-PYoCs_IM-Hfm11AtpJP0SXtE_qQFz33U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vd3d3LnNo/YW5henJhZmlxLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/MS8wMy8yLUNoaWNr/ZW4tTWFqZXN0aWMt/cGljLTItMi5qcGc_/Zml0PTgwMCw1MzIm/c3NsPTE",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 28,
            "name": "Chicken manchurian",
            "price": 40,
            "image": "https://imgs.search.brave.com/ggQA67DVvRvY_0AYkyTo_AeVcKyU6PdtkLvJ1GFRa0Y/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTEy/NjUyOTI0NS9waG90/by9jaGlja2VuLW1h/bmNodXJpYW4tYS1k/aXNoLWF0LWluZGlh/bi1raXRjaGVuLWF0/LXlhdS1tYS10ZWkt/MjRvY3QxNC0wNm5v/dmVtYmVyMjAxNC1s/ZWFkLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz03b29ER1d3/MGRMdXdjWDlXRTVt/WWtLYUxzWmE3R0Zr/UnR2dmJZNW4zRVdB/PQ",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 29,
            "name": "Schezwan Chicken",
            "price": 100,
            "image": "https://imgs.search.brave.com/wcdmtVDp8EKslaWy9B2IqZkMTF21bHpDIgVu8itT0ME/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2hhcm1pc3Bhc3Np/b25zLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMy8wNi9T/Y2hlendhbkNoaWNr/ZW4xLmpwZw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 30,
            "name": "Popcorn Chicken",
            "price": 350,
            "image": "https://imgs.search.brave.com/QvebCmdz-0AaQwjteBKx-17r7DGeayRfue9YHjEJ-Hk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTAw/MDE4NzIyL3Bob3Rv/L3J1c3RpYy1wb3Bj/b3JuLWNoaWNrZW4u/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUI4ZW5wWVFIRmFy/d3l1WnllQWVNRy0x/ZzFrOWl2WHJfSEo3/VmhISFI0WjQ9",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 31,
            "name": "Chiken Nuggets",
            "price": 250,
            "image": "https://imgs.search.brave.com/ngvvP2ZnvnIBGnStktbZvS2Zx86YGUj28CeJX80TOA8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTM3/NzAzMzE3L3Bob3Rv/L2NoaWNrZW4tbnVn/Z2V0cy13aXRoLWtl/dGNodXAuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPXl3UVE4/UkllRDJvUmJ5UXJH/NkpRQkxibzFsYVZF/elhLVTFlY2JnamdY/Sm89",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 32,
            "name": "Chicken pasta",
            "price": 100,
            "image": "https://imgs.search.brave.com/FKWXjI4LCq88xYh1_Puq9AX136BFe6ZEJhDxsfeuAdE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YnVkZ2V0Ynl0ZXMu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDE5LzEwL0NyZWFt/eS1QZXN0by1DaGlj/a2VuLVBhc3RhLWNs/b3NlLVYzLmpwZw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 33,
            "name": "Chicken pulao",
            "price": 125,
            "image": "https://imgs.search.brave.com/Dv-H8qp--6utsAdfqfaRatTIndT7cngJXwlkbg0VZG4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waXBp/bmdwb3RjdXJyeS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMTEvQ2hpY2tl/bi1QdWxhby1QaXBp/bmctUG90LUN1cnJ5/LTkuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 34,
            "name": "Bombay biryani",
            "price": 320,
            "image": "https://imgs.search.brave.com/6wQ2F5JQDwhkJTj3fNAzfutKjc2-jEaPpre1gALaMZ4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGlwc25yZWNpcGVz/YmxvZy5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjIvMDMv/Qm9tYWJ5LUJpcnlh/bmktd2l0aC1vbmlv/bnMuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 35,
            "name": "Chicken Crispy",
            "price": 220,
            "image": "https://imgs.search.brave.com/2pRf7s2gl-0VaiSXs5Y65i6JF9gHaXsP1_ydc8Czdn0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9j/cmlzcHktZnJpZWQt/Y2hpY2tlbi1wbGF0/ZS13aXRoLXNhbGFk/LWNhcnJvdF8xMTUw/LTIwMjEyLmpwZz9z/ZW10PWFpc19oeWJy/aWQ",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 36,
            "name": "Prawn Curry",
            "price": 280,
            "image": "https://imgs.search.brave.com/lwGh4sYJOFd6hzs7vX1y5aMzSee6a3ixQBDmGlzeVyM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9nbGVi/ZWtpdGNoZW4uY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIx/LzEwL3NvdXRoaW5k/aWFucHJhd25jdXJy/eXRvcGJvd2wuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 37,
            "name": "Prawn masala ",
            "price": 185,
            "image": "https://imgs.search.brave.com/tuE7EMfRXYfr3hG2NfwW3wuI5w1z0zlGI35s0ZkXhsk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA2L3ByYXduLWN1/cnJ5LXByYXduLW1h/c2FsYS1yZWNpcGUu/d2VicA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 38,
            "name": "Prawns Fry",
            "price": 190,
            "image": "https://imgs.search.brave.com/MmBaYgSG-1wEKEhxW9qmkBJqSU7vH-42rBKAIiwiVms/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Z29oZWFsdGh5ZXZl/cmFmdGVyLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMy8w/Mi9QcmF3bi1NYXNh/bGEtRnJ5LTYuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 39,
            "name": "Chettinad Prawn masala",
            "price": 225,
            "image": "https://imgs.search.brave.com/_CN4_X36dCvelnnEFLheOK_YIj5fxzZ7ZE3Fxg2MMMU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9odW5n/cnlmb3JldmVyLm5l/dC93cC1jb250ZW50/L3VwbG9hZHMvMjAx/NS8xMi9wcmF3bi1t/YXNhbGFzLTYwMHg1/NzIuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 40,
            "name": "Tandoor prawn",
            "price": 400,
            "image": "https://imgs.search.brave.com/4e71pFWio2BCfixv6aLhVC8VDWvJx3Xjz-PtyFQ7FmE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9ncmVh/dGN1cnJ5cmVjaXBl/cy5uZXQvd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMTIvdGFu/ZG9vcmlwcmF3bnMx/LmpwZw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 41,
            "name": "Paplet fry",
            "price": 380,
            "image": "https://imgs.search.brave.com/_CLYNAEi2t9SrjkKIgzTkiXeWxGtYIMYrJe14ypsZxw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9iMjk1/ODEyNS5zbXVzaGNk/bi5jb20vMjk1ODEy/NS93cC1jb250ZW50/L3VwbG9hZHMvMjAx/NS8xMS9wb21mcmV0/LWZyeS1yZWNpcGUu/anBnP2xvc3N5PTEm/c3RyaXA9MSZ3ZWJw/PTE",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 42,
            "name": "Shrimp Curry",
            "price": 265,
            "image": "https://imgs.search.brave.com/Nx8zzhGbSmzDpw1fgWmKg0vUFw1K1CyNeeC-RpXRKpA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZXJpbmxpdmVzd2hv/bGUuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIyLzEwL3No/cmltcGN1cnJ5LTQt/NjgzeDEwMjQuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 43,
            "name": "Malabar prawn",
            "price": 330,
            "image": "https://imgs.search.brave.com/7fizKcHay85sv0vyFqq8GndENuJKmwYKWDVJziCQVWc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMudG1lY29zeXMu/Y29tL2ltYWdlL3Vw/bG9hZC90X3dlYjc2/N3g2MzkvaW1nL3Jl/Y2lwZS9yYXMvQXNz/ZXRzLzUyODNiNGE1/Zjk4ZGRiZTdkOWQ1/NWJlM2MyYWFjNTRj/L0Rlcml2YXRlcy9j/NzVmMmFlMWEzMTEw/OTNlNTI3NDM1NjNj/NDY2MGJkZGZkZWIz/MWZlLmpwZw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 44,
            "name": "Prawn karahi masala",
            "price": 200,
            "image": "https://imgs.search.brave.com/VMUs57OvieWEPt10T4Wp6WV6oyocSCBO_08GqYvqq7Y/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2FpbnNidXJ5c21h/Z2F6aW5lLmNvLnVr/L3VwbG9hZHMvbWVk/aWEvNzIweDc3MC8w/Ni83Mzg2LTJfUHJh/d25DdXJyeS5qcGc_/dj0xLTA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 45,
            "name": "Shrimp korma",
            "price": 175,
            "image": "https://imgs.search.brave.com/ZYWMtuYFT7FHZRRInn_C6DQUpOBrLbzeNoNUiKMJxww/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9neXBz/eXBsYXRlLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Mi9jYWp1bi1zaHJp/bXAtc2NhbXBpX3Nx/dWFyZTIuanBn",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 46,
            "name": "Prawn puri",
            "price": 120,
            "image": "https://imgs.search.brave.com/0TKjk0ZvmXa3g8ht9B6QStkpDK_eeERcs8x4m4HEnQE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9ncmVh/dGN1cnJ5cmVjaXBl/cy5uZXQvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjAvMDMvcHAx/LmpwZw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 47,
            "name": "Prawn chili",
            "price": 360,
            "image": "https://imgs.search.brave.com/TLN3AJTH0fl5-cKTz2RQBShwUGIOUM0BiRf7WqOsd9U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA1L2FzaWFuLWNo/aWxpLXNocmltcC1j/aGlsbGktcHJhd24u/d2VicA",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 48,
            "name": "Spicy Butter Garlic prawn",
            "price": 520,
            "image": "https://imgs.search.brave.com/gwtrDGAytedM7JNFG9VEWXNm8aalMZ5EOCjvlMAwVl4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFtYXJpbmRudGh5/bWUuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzA2L0No/aWxsaS1HYXJsaWMt/QnV0dGVyLVByYXdu/czQtMS5qcGc",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 49,
            "name": "Shrimp Biryani",
            "price": 300,
            "image": "https://imgs.search.brave.com/qcJw85BjjnA96K-ImQDRRklp512eJJyylsg9AXNT5HQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jYXJh/bWVsdGludGVkbGlm/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTgvMTEvSW5z/dGFudC1Qb3QtU2hy/aW1wLUJpcnlhbmkt/MS5qcGc",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 50,
            "name": "Pomfret tawa fry",
            "price": 420,
            "image": "https://imgs.search.brave.com/a8uPNUaHOm4cTdE5VKW71RnRKiNbR2hY_LjcswR3Ddk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZmFzdGx5LmZvb2R0/YWxrZGFpbHkuY29t/L21lZGlhLzIwMjMv/MDMvMjYvMTAyMTEv/cG9tZnJldC1maXNo/LWZyeS5qcGc_c2l6/ZT03MjB4ODQ1Jm5v/Y3JvcD0x",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 51,
            "name": "Tandoori pomfret",
            "price": 360,
            "image": "https://imgs.search.brave.com/bgfc-Tri4yZrlT2G8G6_FmDxeNEY9w1SxCYr3298BVE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Z29oZWFsdGh5ZXZl/cmFmdGVyLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMi8x/MC9UYW5kb29yaS1w/b21mcmV0LTA5LTc2/OHgxMDI0LmpwZw",
            "status": 200,
            "category":"Non-veg"
        },
        {
            "id": 52,
            "name": "Pomfret fish curry",
            "price": 290,
            "image": "https://imgs.search.brave.com/kxfB88qLt-j6CnoSgYTMXeRUqNaByXSwosoMUbP1cVk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9mZWFz/dHdpdGhzYWZpeWEu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIyLzAzL2Zpc2gt/ZmVhdHVyZS5qcGc",
            "status": 200, 
            "category":"Non-veg"
        },
        {
            "id": 53,
            "name": "Rawa pomfret tawa fry",
            "price": 255,
            "image": "https://imgs.search.brave.com/JsUvAipxLTnox4oazwOI8cPOpnZpoWgKrfc0kj_vSSc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zMy1h/cC1zb3V0aC0xLmFt/YXpvbmF3cy5jb20v/YmV0dGVyYnV0dGVy/YnVja2V0LXNpbHZl/ci9zYW5naXRhLWJh/bmVyamVlMTUyMjk1/MDQ5NTVhYzY2MTVm/YTMxYTYuanBlZw",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 54,
            "name": "Pomfret gravy",
            "price": 400,
            "image": "https://imgs.search.brave.com/x8qcsMjR9rS2575xveoRJkQqu0PLeklB0VSJEwuSzRE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9kMzZ2/NXNwbWZ6eWFwYy5j/bG91ZGZyb250Lm5l/dC93cC1jb250ZW50/L3VwbG9hZHMvMjAx/OS8xMS9wb21mcmV0/LW1hc2FsYS1ncmF2/eTItODQ4eDQyNC5w/bmc",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 55,
            "name": "Crab Masala fry",
            "price": 255,
            "image": "https://imgs.search.brave.com/B-dWIwr_Vgyh0yjZr47dF5MKzzFXBdF9FeqbPEefRIo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9odW5n/cnlmb3JldmVyLm5l/dC93cC1jb250ZW50/L3VwbG9hZHMvMjAx/Ny8wNi9jcmFiLWZy/eS02MDB4NDUwLmpw/Zw",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 56,
            "name": "Crab curry",
            "price": 150,
            "image": "https://imgs.search.brave.com/1o_S8RSY_doGTrXPM5r834qE6r8te1QYQZZQmbxdd04/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2VyaW91c2VhdHMu/Y29tL3RobWIvM2RG/anphY1owZ1NkbGli/TzZVcHVCd0JlU2F3/PS8xNTAweDAvZmls/dGVyczpub191cHNj/YWxlKCk6bWF4X2J5/dGVzKDE1MDAwMCk6/c3RyaXBfaWNjKCkv/X19vcHRfX2Fib3V0/Y29tX19jb2V1c19f/cmVzb3VyY2VzX19j/b250ZW50X21pZ3Jh/dGlvbl9fc2VyaW91/c19lYXRzX19zZXJp/b3VzZWF0cy5jb21f/X3JlY2lwZXNfX2lt/YWdlc19fMjAxNF9f/MDNfXzI1LjAzLjIw/MTQyMFNwaWN5LUlu/ZGlhbi1DcmFiLU1h/c2FsYS1GcnktY2Q3/ZGMzYmEwZDhiNGYz/NDg5YzEzYzQ5ODlk/ZGViNGMuanBn",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 57,
            "name": "Crab fry",
            "price": 245,
            "image": "https://imgs.search.brave.com/qtCZ-1pV7xK2JvrjO2TF_Gz3sbKPP6Y_IFCA2ZccR7k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWFzYWxha29yYi5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTkvMDMvQ3JhYi1N/YXNhbGEtRnJ5LVJl/Y2lwZS1OYW5kdS1W/YXJ1dmFsLVY0Lmpw/Zw",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 58,
            "name": "Crab sukha masala",
            "price": 200,
            "image": "https://imgs.search.brave.com/qtCZ-1pV7xK2JvrjO2TF_Gz3sbKPP6Y_IFCA2ZccR7k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWFzYWxha29yYi5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTkvMDMvQ3JhYi1N/YXNhbGEtRnJ5LVJl/Y2lwZS1OYW5kdS1W/YXJ1dmFsLVY0Lmpw/Zw",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 59,
            "name": "Crab pepper fry",
            "price": 235,
            "image": "https://imgs.search.brave.com/tZ__KsxGLDKfmKns1bvVHV4SnvL-aGHDvLp4a_7k_w0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vYXRteWtp/dGNoZW4ubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIyLzA3/LzIwMjIwNzI1XzIw/NDgwMS0wMTQ3MzI3/Nzc3MDM3ODgxNzA3/NzAuanBlZz9yZXNp/emU9NjQwLDk4NSZz/c2w9MQ",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 60,
            "name": "Green masala crab",
            "price": 195,
            "image": "https://imgs.search.brave.com/aT5RNGKcpuO4ffgAK0-phDtdcxw03UVWXVawbShlp_U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWct/Z2xvYmFsLmNwY2Ru/LmNvbS9yZWNpcGVz/LzlhYzQ3NDYxMWNi/YTAwMjUvNjgweDk2/NGNxNzAvY3JhYi1t/YXNhbGEtcmVjaXBl/LW1haW4tcGhvdG8u/anBn",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 61,
            "name": "Malwan tadka: Surmai fry",
            "price": 500,
            "image": "https://imgs.search.brave.com/PkJSQVjWCnB9jgY9hPw7QuAbtGifkfz-2KrGfVWznq8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vZmxhdm91/cnNvZm15a2l0Y2hl/bi5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjEvMDQvSU1H/XzA2MDgtMy5qcGc_/cmVzaXplPTEwMjQs/NTc1JnNzbD0x",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 62,
            "name": "Surmai masala fry",
            "price": 460,
            "image": "https://imgs.search.brave.com/f8l08yuAqrkjzc3goIVKt9PIO0nmO7wd2XiWrgC41Mk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90aGV5/dW1teWRlbGlnaHRz/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wMy9maXNo/LW1hc2FsYS1mcnkt/cmVjaXBlLmpwZw",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 63,
            "name": "Bangda fry",
            "price": 120,
            "image": "https://imgs.search.brave.com/x0pC6S_FJKfsiMACXU1RM24LRGFQkTn_LA3BCsxhVts/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wYWxh/dGVzZGVzaXJlLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/Mi8wOS9iYW5nZGEt/ZmlzaC1mcnktcmVj/aXBlQHBhbGF0ZXMt/ZGVzaXJlLmpwZw",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 64,
            "name": "Rawa Bnagda fry",
            "price": 150,
            "image": "https://imgs.search.brave.com/YYqYYoLFJb-ggs-RPlyWxGGq4zgCweCmCSqBb7DA510/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aG9tZW1ha2Vyam9i/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMi8wNy9CYW5n/ZGEtZnJ5LWltYWdl/LTEtODRrYi1ob21l/bWFrZXJqb2ItNGJ5/Ni13YXRlcm1hcmst/NjgzeDEwMjQuanBn",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 65,
            "name": "Lemon Garlic King fish Cakes",
            "price": 85,
            "image": "https://imgs.search.brave.com/q8GbMZhAAZAfktt-qDpi6_9Rj7lzj8hdYaau8L97kLw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmV5b25kdGhlY2hp/Y2tlbmNvb3AuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIx/LzAyL0Zpc2gtQ2Fr/ZXMtMy5qcGc",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 66,
            "name": "Malwani fish curry",
            "price": 280,
            "image": "https://imgs.search.brave.com/ZXtrKR9rQ3miH-RS9BfTVRf5zDuEO0hhslYH-vBQRKA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEt/bGlicmFyeS1zZXJ2/aWNlLW1lZGlhL2Ey/NTJmY2I5LTQ4Y2Et/NDQxYy1hYzNlLWRm/ZDRmZTRkOWMyNi5f/X0NSMCwxMTM4LDM0/NzgsMzQ3OF9QVDBf/U1gzMDBfVjFfX18u/anBn",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 67,
            "name": "Egg Butter masal",
            "price": 80,
            "image": "https://imgs.search.brave.com/BjicWQeAVKSEDQ1ozFXBaGpYoZcIrCUroT0zhlRx870/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE4/LzA3L2VnZy1tYXNh/bGEtZ3JhdnktcmVj/aXBlLndlYnA",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 68,
            "name": "Egg Biryani",
            "price": 120,
            "image": "https://imgs.search.brave.com/6u6pYYEBsiegUG-lS3btFJsX1nH2ynbA0qkMaSDcDfA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzI3Lzk0Lzg1/LzM2MF9GXzIyNzk0/ODUzOF94SmRSMktq/dzE0MHJiaVhZUmVh/UjB0dFVGSUJxNGg0/cy5qcGc",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 69,
            "name": "egg kurama",
            "price": 95,
            "image": "https://imgs.search.brave.com/9ohPoW6W1sOUbNxurK7JkqFpIB3iyCA3ZRvyCtk5Ggw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vd3d3LnNo/YXJtaXNraXRjaGVu/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAxNi8xMi9lZ2ct/a3VybWExLmpwZz9y/ZXNpemU9NjEwLDYx/MCZzc2w9MQ",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 70,
            "name": "Egg tikka masal",
            "price": 80,
            "image": "https://imgs.search.brave.com/83ufSImVsjdyKy71cYK_TinwXhpSqF2FqnQt4-atXI0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2hhcm1pc3Bhc3Np/b25zLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxMy8wMi9F/Z2dNYXNhbGE1Lmpw/Zw",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 71,
            "name": "Egg pulao",
            "price": 120,
            "image": "https://imgs.search.brave.com/RYP6wKs1fEhQRitsvnE4EMHZw4diWVgyhYerAVh359A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9taW5p/c3RyeW9mY3Vycnku/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDE5LzExL2VnZy1i/aXJ5YW5pLTEtODUw/eDEyNzUuanBn",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 72,
            "name": "Rawa pomfret tawa fry",
            "price": 345,
            "image": "https://imgs.search.brave.com/xadqkfleKbf1atQHNpIGtUfGK-MbSlqSmfYrjloZV3s/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aG9tZW1ha2Vyam9i/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMi8wOS90YW5k/b29yaS1Qb21mcmV0/LXBhcGxldC1idXR0/ZXJmaXNoLW1hc2Fs/YS1maXNoLWZyeS1j/bG9zZS11cC1waG90/by1pbWFnZS1ieS1o/b21lbWFrZXJqb2Iu/Y29tXy02ODN4MTAy/NC5qcGc",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 73,
            "name": "Shahi egg curry",
            "price": 135,
            "image": "https://imgs.search.brave.com/QuKlU2_GDZUO3cKveJPfcc-kZkpDBLoq9eqsMN5OSl0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIy/LzA0L2VnZy1jdXJy/eS53ZWJw",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 74,
            "name": "Egg omelet",
            "price": 50,
            "image": "https://imgs.search.brave.com/X_cFhkqxVHI5kumam65VkxIhQuyYNNJ4QWJPpKjG1z4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA2L2VnZy1vYXRz/LW9tZWxldHRlLndl/YnA",
            "status": 200,
             "category":"Non-veg"

        },
        {
            "id": 75,
            "name": "Vadapav",
            "image": "https://imgs.search.brave.com/YysqR7wAY_FYUAh0TtgR3_rwWZ-9zF0b4jFwzP1uqMM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMy/OTIxMjc0My9waG90/by92YWRhLXBhdi5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/SzA4V2xMOFl4ampM/QzVNZm11aUtoSEkw/NFJaLVVHc1ZBUVZJ/QktkdS1RTT0",
            "price": 20,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 76,
            "name": "Pav-Bhaji",
            "image": "https://imgs.search.brave.com/kp1WEXN3lPvbG9PCB6ZF5mAqC3QR0avPKBgAFbzRL-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEwLzQyLzQxLzA1/LzM2MF9GXzEwNDI0/MTA1NTVfelNkNFRT/b1dVejQ3VUZrSFVl/Z3ZYclY3Z3RnalJE/OEQuanBn",
            "price": 90,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 78,
            "name": "Misal-Pav",
            "image": "https://imgs.search.brave.com/8DSPLTlHRqySdqGiq46Em7vwPPdbzz3MSy8hMD-OAWs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jLm5k/dHZpbWcuY29tLzIw/MjAtMDEvdmE5M3Bo/amNfNjIwLV82MjV4/MzAwXzIxX0phbnVh/cnlfMjAuanBn",
            "price": 60,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 79,
            "name": "Vada Usal",
            "image": "https://imgs.search.brave.com/CyPRuGj_N0Vcjzv1j5L2fNlI392bP8s_TbtZe_IZSa8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWct/Z2xvYmFsLmNwY2Ru/LmNvbS9yZWNpcGVz/L2JhYzYzYmI2ZDI3/NjRlZjYvNjgweDQ4/MmNxNzAvdmFkYS11/c2FsLXJlY2lwZS1t/YWluLXBob3RvLmpw/Zw",
            "price": 80,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 80,
            "name": "Kat vada",
            "image": "https://imgs.search.brave.com/X8gal5hioryzHatW7hruNAideWp8gntxDIKXmaw3-9Q/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9rYXQt/dmFkYS13YWRhLWJh/dGF0YS1zYW1iYXIt/dXNhbC1zcGljeS10/YXN0eS1zbmFjay1i/cmVha2Zhc3QtbWFo/YXRhc2h0cmEtLXZh/ZGEtcG90YXRvLXBh/dHRpZXMtc2VydmVk/LXNhdWNlLWN1cnJ5/LTE4OTc3NjEyMS5q/cGc",
            "price": 100,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 81,
            "name": "Aloo paratha",
            "image": "https://imgs.search.brave.com/g0KvWA7LgTeQWIhRu8xf8j-zwou-dVu7lJpbkCmv648/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzE5LzAyLzc5/LzM2MF9GXzkxOTAy/NzkwN19lbXFXa1pu/T3JhbnJHU21OZWd2/VmhQYWdCSEpCT0x5/QS5qcGc",
            "price": 45,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 82,
            "name": "Methi paratha",
            "image": "https://imgs.search.brave.com/bbCW0pMVXmgyJQx92-9jQs26KzUugRaFb1o95c4I72U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE5/LzA3L2Vhc3ktbWV0/aGktcGFyYXRoYS53/ZWJw",
            "price": 45,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 83,
            "name": "Khakhra",
            "image": "https://imgs.search.brave.com/1DNhbDQpZijIlpNYUtMlpylBgogP20EDwU6JIGlxv9o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/amV5YXNocmlza2l0/Y2hlbi5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjIvMDQv/MTM5NzQxOTk0NzJf/YTg5ODBhYzRjMV96/LmpwZw",
            "price": 25,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 84,
            "name": "Aloo-Tiki",
            "image": "https://imgs.search.brave.com/E4np_1NLCXqg5yXySn2EV0_goPz2JAx2p8MiA7emqJw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzAwLzQ2Lzc1/LzM2MF9GXzkwMDQ2/NzUyM19hUDd5UWxy/bkc2RVFqZGNpNjhK/UE5JakVvUWh5d3dX/SS5qcGc",
            "price": 70,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 85,
            "name": "Idli",
            "image": "https://imgs.search.brave.com/Et77jwaZ3LTMyXLYgCH4NDydu-S8BxkWijGSWV2Znr4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjcw/OTA3OTc1L3Bob3Rv/L2Nsb3NlLXVwLW9m/LWlkbGktYW5kLWNo/dXRuZXkuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPTltMFZU/UzlUWFNYdFQ1aDg1/OFRuZ3dMSHF1MEtG/YUw4NjVOTjJ5RjRp/cFE9",
            "price": 25,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 86,
            "name": "Dosa",
            "image": "https://imgs.search.brave.com/VraK_muoSxJFGVaPQxkGL6pUt1BMLaq8NKa75y4cmWQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzg2LzMzLzcy/LzM2MF9GXzE4NjMz/NzIwOV85cmJjTUx1/M3dHQ0ROYUVvSzFq/TzBhTnpiMHB2N1hz/Ny5qcGc",
            "price": 35,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 87,
            "name": "Rawa-Dosa",
            "image": "https://imgs.search.brave.com/WSWP3ycQDFLns2Vdj3TsbBJdw_CYi7qx8d7jCp5cxN0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/LnN3aWdneS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjQv/MDYvSW1hZ2UtMV9Q/bGFpbi1Eb3NhLTEw/MjR4NTM4LnBuZw",
            "price": 30,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 88,
            "name": "Uttapa",
            "image": "https://imgs.search.brave.com/xuhQpTUb_PgrMOqMtI9d4KZcOLykijhTqlvhKPCa1S8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE2/LzA4L3Nvb2ppLXV0/dGFwYW0tcmVjaXBl/LTAxNi53ZWJw",
            "price": 55,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 89,
            "name": "Mendu-vada",
            "image": "https://imgs.search.brave.com/IwMA-cEVQBZpdGxSAtQ_nEZqtCu4olk_uMJzJ0X1Ov4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzMzLzU3LzYw/LzM2MF9GXzkzMzU3/NjA2NF83MEYzYmYx/UG1UREsxUHVOSDZv/Z244dER3NmlMQ3JV/eS5qcGc",
            "price": 25,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 90,
            "name": "Masala-pav",
            "image": "https://imgs.search.brave.com/5vfKlqPvnz-ka4NxnpCHxlN4IpDnEZZiB8s9mHMawk8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vY3Vycnlh/bmR2YW5pbGxhLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAx/Ni8xMS9wYXYtbWFz/YWxhLmpwZz93PTcy/MCZzc2w9MQ",
            "price": 25,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 91,
            "name": "Dabeli",
            "image": "https://imgs.search.brave.com/xrcVf4Fr7UR2KAG2R9_HBa_zByhv4I3p7JeDANoeayA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vbXl2ZWdl/dGFyaWFucm9vdHMu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzA2L0RTQ18w/MDY2LmpwZWc_cmVz/aXplPTEwMjQsNzc5/JnNzbD0x",
            "price": 20,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 92,
            "name": "Roti",
            "image": "https://imgs.search.brave.com/ORXpOxdCHdRaphluMTscgyH31RKZ208e8Tip0lH9w7c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1LzU4Lzc0LzQy/LzM2MF9GXzU1ODc0/NDIxMV91VVpxdGVi/QjJ1YWttaEpoZmdt/enU0UE0yS2hlNmhT/Uy5qcGc",
            "price": 15,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 93,
            "name": "Tandoor roti",
            "image": "https://imgs.search.brave.com/6vDVv4OLeXVm--ON8tNd4gg2Fq-rRMJ-gsEW1kNw7gA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjM2/MTc2NDI4L3Bob3Rv/L3RhbmRvb3JpLXJv/dGkuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPUFsTE1rMkNE/RTk1cGtSZUNXQXRm/MnN2d1RsSjNlN1NX/eUdKMkg4Y1FSYzQ9",
            "price": 30,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 94,
            "name": "Naan",
            "image": "https://imgs.search.brave.com/9RBy4SEHrXFhNdQAYaFg2Y1xlxh1YXcBj6ixYuukmSs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9lYXR5/b3Vyd29ybGQuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzA4L2JyZWFkcy1u/YWFuLXJvdGktY2hh/cGF0aS1oaWdoLXJl/cy0xMDI0eDc2OS5q/cGc",
            "price": 25,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 95,
            "name": "Bhakri",
            "image": "https://imgs.search.brave.com/BqClToLRCnQissDJw8y_O1U52u3aXidGMxfQ9hGxxds/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Zmxhdm9yc29mbXVt/YmFpLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxMS8wNy9z/cHJlYWQtZ2hlZS1I/b3ctdG8tbWFrZS1S/aWNlLUJoYWtyaS5q/cGc",
            "price": 20,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 96,
            "name": "Pran-Poli",
            "image": "https://imgs.search.brave.com/WnxeTOE1oSry-1eCGTFFuCieUxrEM6Ho2--_CFd3ITk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmVncmVjaXBlc29m/aW5kaWEuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDEyLzA5/L3B1cmFuLXBvbGkt/cmVjaXBlMTguanBn",
            "price": 50,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 97,
            "name": "Modak",
            "image": "https://imgs.search.brave.com/vs3X5q4YH5uajDLaeQVw489ItXLakjEewccyoWUutDI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vcGhvdG9z/L21vZGFrLW9uLWEt/YmFuYW5hLWxlYWYt/cGljdHVyZS1pZDgz/NTE3Mzg2ND9rPTIw/Jm09ODM1MTczODY0/JnM9NjEyeDYxMiZ3/PTAmaD1GWTM0RktE/VVZkVUNjZEZnbTY2/OW00VW8tQ25HSmJM/T1BCMFlXNWNwdWlj/PQ.jpeg",
            "price": 100,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 98,
            "name": "Puri-Bhaji",
            "image": "https://imgs.search.brave.com/-i_MgP6AKS9A9h1AD-2gZmP8Hj19m2dmwT4Ea0iIZr4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzYxLzQ5LzI5/LzM2MF9GXzYxNDky/OTAyX29mZWtvdWx1/Y2Izbkh0VTdWa1ds/dzFXSzh4dlhWaDA5/LmpwZw",
            "price": 80,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 99,
            "name": "Shev-Bhaji",
            "image": "https://imgs.search.brave.com/PR6zo4qlmoKLTYVHjjSyJjy9AjbTvsFfWPVghN1oJEg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9oZWFs/dGh5dmVncmVjaXBl/cy5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDQvSU1H/XzM1MzctNTcweDQy/Ny5qcGc",
            "price": 150,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 100,
            "name": "Ghavne",
            "image": "https://imgs.search.brave.com/GbYWAhec0OZbSZd4YBU7QnxJjsll4NriEzuYvH-0N94/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vq/bS1yMU85TGRlU0hB/Nloyd1hJbkU3UTRu/V0ttUjBRd0s3X2h0/NjlkcnBsRWxHRUhM/TWJKNnF6T09WaHJf/eHZ1X0g0MFNZYnVQ/S19HcUhSeHptUGJP/TTdpcHVKcHR6YjN0/UzJpX2R1eFVNRk5o/WDNlUFFrenZpd0dX/SkkxRW02OUc1N0F4/Y0ZEQWM4Q1UvczMy/MC9HaGF2bmVBcHBh/bVBhbmNha2UrKDUp/LkpQRw",
            "price": 50,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 101,
            "name": "Shabudana-vada",
            "image": "https://imgs.search.brave.com/pMwVSB8_vnz2RU8Wtejg3lePAeuEPjFtIalO4dH26U4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEwLzk0LzE4LzIw/LzM2MF9GXzEwOTQx/ODIwMTZfd2pPN0ta/Q2d3dXUxc2VpZjQy/UHRmbFp4T1dCbGNJ/T2guanBn",
            "price": 40,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 102,
            "name": "Shengdana Chutney",
            "image": "https://imgs.search.brave.com/eP9MIsd-pkJznzqy08qi_BjHu1ahHMv1HBuZNBidZr8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jLm5k/dHZpbWcuY29tLzIw/MjMtMDUvNjd2MWQz/am9fcGVhbnV0LWNo/dXRuZXktd2l0aC1j/aGlsbGktYW5kLWdh/cmxpY182MjV4MzAw/XzA5X01heV8yMy5q/cGc",
            "price": 30,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 103,
            "name": "Kolhapuri-thecha",
            "image": "https://imgs.search.brave.com/2TnFlU-I2Hoy1QP7Mq6LPuFp9mCSowRd0JRVHfdlwUo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9uZWVs/YW1mb29kbGFuZG11/bWJhaS5jb20vY2Ru/L3Nob3AvcHJvZHVj/dHMvSU1HXzk4NTNf/YTdhZTkwZjUtY2Ux/ZC00MWQ4LTg0NWIt/ZWI4NzIxM2RkZTA2/XzgwMHguanBnP3Y9/MTY0NDkyMjU3MA",
            "price": 45,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 104,
            "name": "Mirchicha-thecha",
            "image": "https://imgs.search.brave.com/LdLj5GcvC6U6kOsC4YAEU7rA8aUSM3719b7TZv9vMOo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vY3Vycnlh/bmR2YW5pbGxhLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAx/Ni8xMC9jaGlsaS1j/aHV0bmV5Mi0yLmpw/Zz93PTcyMCZzc2w9/MQ",
            "price": 30,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 105,
            "name": "Paneer Masala",
            "image": "https://imgs.search.brave.com/fcFgF7Y4BPqtcP0Wp1pCvCrRFs9FKggx-SqBvH-oDwQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlc3BpY2Vob3Vz/ZS5jb20vY2RuL3No/b3AvYXJ0aWNsZXMv/bGFyZ2VfUGFuZWVy/X01hc2FsYV9fYm93/bF81MDlhODE3Ni0z/Njg3LTQwZjMtOWEw/Yy01ZjZmY2FiMzBm/MDlfNzIweC5qcGc_/dj0xNTc4OTM0OTc2",
            "price": 250,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 106,
            "name": "Malai-paneer",
            "image": "https://imgs.search.brave.com/2q9DVCuyWOg5i55TmsrQlVQ3DBFdUVs2csYqYPNcZSU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4y/LmZvb2R2aXZhLmNv/bS9zdGF0aWMtY29u/dGVudC9mb29kLWlt/YWdlcy9jdXJyeS1y/ZWNpcGVzL21hbGFp/LXBhbmVlci1yZWNp/cGUvbWFsYWktcGFu/ZWVyLXJlY2lwZS5q/cGc",
            "price": 280,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 107,
            "name": "Paneer crispy",
            "image": "https://imgs.search.brave.com/dvB-CgvFoTAuDDwwXw_PNN7HMUt13YBsvpnt_BKakTo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzA3L3Bhbi1mcmll/ZC1wYW5lZXItZnJ5/LTAwOC53ZWJw",
            "price": 290,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 108,
            "name": "Paneer pakoda",
            "image": "https://imgs.search.brave.com/3JYe0D6oa3VDySMaNC4Fz9z64bHqBwuNLdqAOsLaAK0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE2/LzA2L3BhbmVlci1w/YWtvZGEud2VicA",
            "price": 65,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 109,
            "name": "Paneer chili",
            "image": "https://imgs.search.brave.com/ZUFPmJln9ABfEb-PyX9hI0NBECUvjV8YPnNnSq5ppBE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0Lzc1Lzk3LzYx/LzM2MF9GXzQ3NTk3/NjE1N19rSnVjNktm/eWlEb2FUZlNGTHQ4/Q0Q5T2xoUFJyQ2hm/Uy5qcGc",
            "price": 150,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 110,
            "name": "Dal Tadka",
            "image": "https://imgs.search.brave.com/DQDjPwj1xTQhVep2b_WR0elKOyvXfd8B0n7_v05tfwQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzUyLzMzLzIz/LzM2MF9GXzk1MjMz/MjMxM180YWlNRkE5/dkRuYWZrSlpISFcy/bUxIcGxVYmtjazMz/SC5qcGc",
            "price": 85,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 111,
            "name": "Dal-Khichdi",
            "image": "https://imgs.search.brave.com/TuHnv1ZHlg4MaNVXqdfVTR73TtecJaBCUeOufs19lHc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzExLzExLzIyLzIy/LzM2MF9GXzExMTEy/MjIyMDNfMnQ5NnIw/bXJFYldYNzhaWkU0/OEQwVFVvUVJIdDZq/ZmguanBn",
            "price": 95,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 112,
            "name": "Sambar",
            "image": "https://imgs.search.brave.com/w2jd9cGlRZzjNea3JnkyCPniWqlCe756qKah5Ye7W-k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzcxLzk0Lzg1/LzM2MF9GXzQ3MTk0/ODU3N19acGY3eTdB/UFY1c3ByeThYYXha/MWtZT0pHRDNFYW1G/YS5qcGc",
            "price": 70,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 113,
            "name": "Mashroom Masala",
            "image": "https://imgs.search.brave.com/YFZcH7mcsS-WLXpwG6aWfxW9CXR-uCDTFTWZ3ckum3Q/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/amV5YXNocmlza2l0/Y2hlbi5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMTMvMDQv/bXVzaHJvb20tbWFz/YWxhLmpwZw",
            "price": 220,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 114,
            "name": "Mushroom fry",
            "image": "https://imgs.search.brave.com/M8o97GxqdqXH_1rg41jKEo59yFIkfSykMM_V35zfNTM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmVncmVjaXBlc29m/aW5kaWEuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDEzLzA2/L211c2hyb29tLWNo/aWxsaS1mcnktcmVj/aXBlMTkuanBn",
            "price": 190,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 115,
            "name": "Mushroom chili",
            "image": "https://imgs.search.brave.com/wJe0g4EfmNHUV62DJhCKHGWgrt-sWObUOv19thjOC8k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9saDct/dXMuZ29vZ2xldXNl/cmNvbnRlbnQuY29t/L2RvY3N6L0FEXzRu/WGU2WFl3cDYyVG9K/dWFhd1ZNeHlHRVlS/WjZaZWY1UncxQ3JH/REZDNFpTcnlMRG5i/aUlQSkZuTEczemIz/UG44RWdfOEVQVlhU/WW5kcmNMcE9JYlJJ/b2FzaVFmeF93Q1V1/UWZaV3ZQVlo2aTB0/bmlFbFpUZDVYc0Jr/dDVBdFpZdWRTOUNN/Q055RUFFQm1MWTQy/YmxKaXNZZWRKWT9r/ZXk9QVJnSHpzM0th/eFdoRHZvSUtwWVQ4/Zw.jpeg",
            "price": 220,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 116,
            "name": "Grilled mushroon Skew",
            "image": "https://imgs.search.brave.com/wJe0g4EfmNHUV62DJhCKHGWgrt-sWObUOv19thjOC8k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9saDct/dXMuZ29vZ2xldXNl/cmNvbnRlbnQuY29t/L2RvY3N6L0FEXzRu/WGU2WFl3cDYyVG9K/dWFhd1ZNeHlHRVlS/WjZaZWY1UncxQ3JH/REZDNFpTcnlMRG5i/aUlQSkZuTEczemIz/UG44RWdfOEVQVlhU/WW5kcmNMcE9JYlJJ/b2FzaVFmeF93Q1V1/UWZaV3ZQVlo2aTB0/bmlFbFpUZDVYc0Jr/dDVBdFpZdWRTOUNN/Q055RUFFQm1MWTQy/YmxKaXNZZWRKWT9r/ZXk9QVJnSHpzM0th/eFdoRHZvSUtwWVQ4/Zw.jpeg",
            "price": 280,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 117,
            "name": "Grilled paneer Skew",
            "image": "https://imgs.search.brave.com/GQiLXpIAo-x9wRZZZ-ypw1HTuaHcmDfMXuXVwWVm3Zw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS1jZG4yLmdyZWF0/YnJpdGlzaGNoZWZz/LmNvbS9tZWRpYS9p/dHJrMTRjdS9pbWcx/NjM5MC53aHFjXzc2/OHg1MTJxODBmcHQ1/NjZmcGw0NzcuanBn",
            "price": 300,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 118,
            "name": "Fried Rice",
            "image": "https://imgs.search.brave.com/ERUT1Ll53gzPEUmkn4qjx-k4XzIBffNrSmg3zUm98kM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzQ1LzE5Lzg3/LzM2MF9GXzQ1MTk4/NzUzX1JHWjZ3U21j/dExvSGxVdkc0ZTU0/VllwbmhmSmE4NHVR/LmpwZw",
            "price": 200,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 119,
            "name": "Schezwan rice",
            "image": "https://imgs.search.brave.com/2-_Qfxj1B5dxbu13wAm9FXU_ctQYoOFc13-ojzegFe8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmVncmVjaXBlc29m/aW5kaWEuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIxLzAy/L3NjaGV6d2FuLWZy/aWVkLXJpY2UxNC5q/cGc",
            "price": 200,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 120,
            "name": "Jeera Rice",
            "image": "https://imgs.search.brave.com/zqfKac8uk1ACVQVZQt2RPXKXLava9-8IUDtuocN1aJE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vbXl2ZWdl/dGFyaWFucm9vdHMu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIyLzAyL0RTQ18w/MDIwLmpwZWc_Zml0/PTE5MjAsMTI3NyZz/c2w9MQ",
            "price": 100,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 121,
            "name": "Pulao",
            "image": "https://imgs.search.brave.com/AhpV35ZfB_Typc0yzKdXgciv8KBi3ZqPdM-Npt-2cS4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzI0LzM1Lzcz/LzM2MF9GXzgyNDM1/NzMwNl9SVjhPOWJO/ZWl2eVFNN0pYZXh1/d0NwMHJKNmhJaDQx/Qy5qcGc",
            "price": 210,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 122,
            "name": "Akkha Masoor",
            "image": "https://imgs.search.brave.com/4JJCOJv8N87ItSNwP79yN7ferA8leexgJHTv7XXmE4o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tYWRo/dXJhc3JlY2lwZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMTAvQWtraGEt/TWFzb29yLU1hcmF0/aGktUmVjaXBlLmpw/Zw",
            "price": 220,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 123,
            "name": "Solkadhi",
            "image": "https://imgs.search.brave.com/jdP4V8WmPjY1IFjNw0ybSdINo3Jses_t19EDiwm4SNE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy80/LzQ2L1NvbGthZGhp/LmpwZw",
            "price": 40,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 124,
            "name": "Gulanjamun",
            "image": "https://imgs.search.brave.com/1mdQBniOEKjQs6NQtfFn1v0nKxM9mZb-wwLXYAzB7pA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA2LzIxLzU0LzQx/LzM2MF9GXzYyMTU0/NDEyOF9pbkJqTFlv/bXpYTEdGaU5Wcmk5/ZWJpckgxTU1KN2ln/ZS5qcGc",
            "price": 50,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 125,
            "name": "Masala papad",
            "image": "https://imgs.search.brave.com/m8FNYvOBA8Wy4iUifZJ5e1eDM14jWyXsg_HXFzAiqmE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmVncmVjaXBlc29m/aW5kaWEuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE0LzEx/L21hc2FsYS1wYXBh/ZC1yZWNpcGUxMS5q/cGc",
            "price": 20,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 126,
            "name": "VegKolhapuri",
            "image": "https://imgs.search.brave.com/Js5biN3Q98nAv49k3rzacBSndd5YIBSfAJXka-dI2XM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2F5bWVkaWEt/Y29udGVudC5jb20v/LmltYWdlL2NfbGlt/aXQsY3Nfc3JnYixm/bF9wcm9ncmVzc2l2/ZSxxX2F1dG86ZWNv/LHdfNzAwL01UYzBO/REk0TURVMU5URTRN/emc1TmpBNC9ob3ct/dG8tbWFrZS1yZXN0/YXVyYW50LXN0eWxl/LXZlZy1rb2xoYXB1/cmktY3VycnkuanBn",
            "price": 180,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 127,
            "name": "Veg Thali",
            "image": "https://imgs.search.brave.com/5MxP5GzYWCaBvWPDHBRDF8psoE9_btAggCN6CRXyh7M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzE0LzAzLzAz/LzM2MF9GXzkxNDAz/MDMzOF9VOHlzemV6/a2JLSmJtYXQyMmxE/UjMzdWhHQW9YZGFj/Wi5qcGc",
            "price": 300,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 128,
            "name": "Pakode",
            "image": "https://imgs.search.brave.com/Ehu7D30GoVC-LpJcHLi0TMzv4si1IXoBETEv0DjP6b4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hYXJ0/aW1hZGFuLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMy8x/Mi9NYXRhci1QYWtv/ZGEtUmVjaXBlLmpw/Zw",
            "price": 50,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 129,
            "name": "Aloo gobi Matar",
            "image": "https://imgs.search.brave.com/y33JZZg6NQfbk0c28HmpuqfD0fDS97POoTiaPE37uJM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vY29va2lu/Z2Zyb21oZWFydC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMTEvQWxvby1H/b2JpLU1hdGFyLTEu/anBnP3Jlc2l6ZT03/MjAsNTQwJnNzbD0x",
            "price": 90,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 130,
            "name": "Aloo Bhaji",
            "image": "https://imgs.search.brave.com/7QP9qtzzesln84EkdvAbwgpaLQRmdD7rfREWrZmNmXg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly95dW1t/eWluZGlhbmtpdGNo/ZW4uY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDE4LzAyL3Bv/dGF0by1iaGFqaS1h/bG9vLWJoYWppLmpw/Zw",
            "price": 70,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 131,
            "name": "Chana Garlic",
            "image": "https://imgs.search.brave.com/6-9Fz4_HbakkGKJY09M_T_6P_Ri3vBrD1ma3s-KQoaA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWlzdHlyaWNhcmRv/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMi8wMy9HYXJs/aWMtQ2hhbmEtQ2hh/YXQtNy1zY2FsZWQu/anBn",
            "price": 120,
            "category": "Veg",
            "status": 200
        },
        {
            "id": 132,
            "name": "Chole masala",
            "image": "https://imgs.search.brave.com/qoeoRHnxWgmO0HUa2Bx0zHV3ge81iAm84aHEzu5aCCk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/a2VlcGluZ3RoZXBl/YXMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzA4L3B1/bmphYmktY2hvbGUt/Ni0xMDI0eDc0MC5q/cGc",
            "price": 180,
            "category": "Veg",
            "status": 200
        },
        {
            "id":136,
            "name":"shahi paneer",
            "image":"https://imgs.search.brave.com/fhsWwMbhbWJnZwS8Ul6NXm-o9xlArvn5tFJNmX0XbQo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9mbGF2/YXJpY2guY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE4LzA3/L3BhbmVlci0xLmpw/Zw",
            "price":155,
            "category":"Veg",
            "status":200
        },
        {
            "id":137,
            "name":"Palak paneer",
            "image":"https://imgs.search.brave.com/XGCaiTpqvr4u_woRLD74gakNRKQHncWFnp3UEd-gWBA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4LzkwLzMxLzQy/LzM2MF9GXzg5MDMx/NDI3NV9BekFPNmpw/MUpyN0R5RDNRblpD/TlBVWnV1OFhVSmtD/ai5qcGc",
            "price":180,
            "category":"Veg",
            "status":200
        },
        {
            "id":138,
            "name":"Palak pakode",
            "image":"https://imgs.search.brave.com/ZydaxVdzpv8hWoch9puGThz71LLXmQ74AFuZ5LcAPBY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9iZXlv/bmRmbG91cmJsb2cu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIyLzA5L3BhbGFr/LXBha29kYS02Lmpw/Zw",
            "price":75,
            "category":"Veg",
            "status":200
        },
        {
            "id":139,
            "name":"Thali peeth",
            "image":"https://imgs.search.brave.com/sQiJyL5xxAfYdk7GcqnqvjtWaUYOkeAitEQ5Z8zBfrQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tYWRo/dXJhc3JlY2lwZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDMvQmhhamFu/aWNoZS1UaGFsaXBl/ZXRoLUZlYXR1cmVk/LmpwZw",
            "price":80,
            "category":"Veg",
            "status":200
        },
        {
            "id":140,
            "name":"Masale Bhat",
            "image":"https://imgs.search.brave.com/IdLCG2avHA_LFbD4VRDKuAQZzHZu3sXceGIW6ORDJ1k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tYWRo/dXJhc3JlY2lwZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMTAvTWFzYWxl/LUJoYXQuanBn",
            "price":125,
            "category":"Veg",
            "status":200
        },
        {
            "id":141,
            "name":"Narli Bhat",
            "image":"https://imgs.search.brave.com/2YtVDUbtCNN-2fRTxifL5bYGU5FAW28Z-ngNEb0d1z8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Zmxhdm91cm9mZm9v/ZC5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjAvMDgvTmFy/YWxpLUJoYXQtMDIu/anBlZw",
            "price":160,
            "category":"Veg",
            "status":200
        },
        {
            "id":142,
            "name":"Matki Usal",
            "image":"https://imgs.search.brave.com/CsMk6Lh7WO8v_7jC7MsuLPxNZZGRb5so9pSC06Eu1Bo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zaHdl/dGFpbnRoZWtpdGNo/ZW4uY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDE1LzA2L01h/dGtpLVVzYWwtMS0z/NjB4MzYwLmpwZw",
            "price":85,
            "category":"Veg",
            "status":200
        },
        {
            "id":143,
            "name":"Dalimbi usal",
            "image":"https://imgs.search.brave.com/xx8MxFjPLmudLX6NPdfclq4dqcp3ho3uSHq-WH7D_vE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hYWhh/YXJhbW9ubGluZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMDUvS2Fkd2Vf/VmFsYWNoaV9Vc2Fs/LndlYnA",
            "price":95,
            "category":"Veg",
            "status":200
        },
        {
            "id":144,
            "name":"Koshimbir",
            "image":"https://imgs.search.brave.com/A-u7fslxjKECb-yr3HM8j5vxHX9vW4QgAfjn818_Rp4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vZGVsaXNo/Yml0ZS5pbi93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMi8wOC9i/bG9nXzEtMS5qcGc_/cmVzaXplPTEwMDAs/ODAwJnNzbD0x",
            "price":100,
            "category":"Veg",
            "status":200
        },
        {
            "id":145,
            "name":"Zunka Bhakri",
            "image":"https://imgs.search.brave.com/HijFuDC5K4Z-EEPX3kAgIzv50vyHaWc05HlDVu3X3ww/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWct/Z2xvYmFsLmNwY2Ru/LmNvbS9yZWNpcGVz/LzRlZTMwYTk3NzMy/MzI5NTgvNjgweDQ4/MmNxNzAvenVua2Et/d2l0aC1iaGFrcmkt/cmVjaXBlLW1haW4t/cGhvdG8uanBn",
            "price":120,
            "category":"Veg",
            "status":200
        },
        {
            "id":146,
            "name":"Palak paratha",
            "image":"https://imgs.search.brave.com/67aPLSOFO63j4wZeedVuSd9Djnfc2zBE85LdbarV0eg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIx/LzA1L3BhbGFrLXBh/cmF0aGEud2VicA",
            "price":85,
            "category":"Veg",
            "status":200
        },
        {
            "id":147,
            "name":"Lacha Onion Salad",
            "image":"https://imgs.search.brave.com/cbARAgF7PcLfEi86x7kEmV1yUQeJiic3QdndWCXb9wM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWct/Z2xvYmFsLmNwY2Ru/LmNvbS9yZWNpcGVz/L2RkNWVmYWMzZThh/NjAzMmIvNjgweDQ4/MmNxNzAvbGFjaGEt/b25pb24tc2FsYWQt/cmVjaXBlLW1haW4t/cGhvdG8uanBn",
            "price":65,
            "category":"Veg",
            "status":200
        },
        {
            "id":148,
            "name":"Saag Paneer",
            "image":"https://imgs.search.brave.com/eJEgIyxj4gb2uUJTOSvL24p93-Z82iqgxpAT57fpH0g/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaW1tZWRpYXRl/LmNvLnVrL3Byb2R1/Y3Rpb24vdm9sYXRp/bGUvc2l0ZXMvMzAv/MjAyMC8wOC9zYWFn/LXBhbmVlci00ODkz/MTcwLmpwZz9xdWFs/aXR5PTkwJnJlc2l6/ZT00NDAsNDAw",
            "price":320,
            "category":"Veg",
            "status":200
        },
        {
            "id":149,
            "name":"Bombay Aloo",
            "image":"https://imgs.search.brave.com/He69Gce0QQ5EmOMkYHtWSdxI-VCF8sR5XaRvC1G6xEM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2ltcGx5cmVjaXBl/cy5jb20vdGhtYi92/OGprbHhpYmFGcGNT/bzlBWlJMcEhkUGk4/X1U9LzE1MDB4MC9m/aWx0ZXJzOm5vX3Vw/c2NhbGUoKTptYXhf/Ynl0ZXMoMTUwMDAw/KTpzdHJpcF9pY2Mo/KS9TUkJvbWJheVBv/dGF0b2VzTGVhZC0x/LTY1YmYyMDQyNzA0/YzRmNWZiMjI5YTFm/ZjMzMTQ0YjEzLmpw/Zw",
            "price":290,
            "category":"Veg",
            "status":200
        },
        {
            "id":150,
            "name":"Gobi Manchurian",
            "image":"https://imgs.search.brave.com/He69Gce0QQ5EmOMkYHtWSdxI-VCF8sR5XaRvC1G6xEM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2ltcGx5cmVjaXBl/cy5jb20vdGhtYi92/OGprbHhpYmFGcGNT/bzlBWlJMcEhkUGk4/X1U9LzE1MDB4MC9m/aWx0ZXJzOm5vX3Vw/c2NhbGUoKTptYXhf/Ynl0ZXMoMTUwMDAw/KTpzdHJpcF9pY2Mo/KS9TUkJvbWJheVBv/dGF0b2VzTGVhZC0x/LTY1YmYyMDQyNzA0/YzRmNWZiMjI5YTFm/ZjMzMTQ0YjEzLmpw/Zw",
            "price":75,
            "category":"Veg",
            "status":200
        },
        {
            "id":151,
            "name":"Kothimbir vadi",
            "image":"https://imgs.search.brave.com/He69Gce0QQ5EmOMkYHtWSdxI-VCF8sR5XaRvC1G6xEM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2ltcGx5cmVjaXBl/cy5jb20vdGhtYi92/OGprbHhpYmFGcGNT/bzlBWlJMcEhkUGk4/X1U9LzE1MDB4MC9m/aWx0ZXJzOm5vX3Vw/c2NhbGUoKTptYXhf/Ynl0ZXMoMTUwMDAw/KTpzdHJpcF9pY2Mo/KS9TUkJvbWJheVBv/dGF0b2VzTGVhZC0x/LTY1YmYyMDQyNzA0/YzRmNWZiMjI5YTFm/ZjMzMTQ0YjEzLmpw/Zw",
            "price":100,
            "category":"Veg",
            "status":200
        },
        {
            "id":152,
            "name":"Rajma Masala",
            "image":"https://imgs.search.brave.com/He69Gce0QQ5EmOMkYHtWSdxI-VCF8sR5XaRvC1G6xEM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2ltcGx5cmVjaXBl/cy5jb20vdGhtYi92/OGprbHhpYmFGcGNT/bzlBWlJMcEhkUGk4/X1U9LzE1MDB4MC9m/aWx0ZXJzOm5vX3Vw/c2NhbGUoKTptYXhf/Ynl0ZXMoMTUwMDAw/KTpzdHJpcF9pY2Mo/KS9TUkJvbWJheVBv/dGF0b2VzTGVhZC0x/LTY1YmYyMDQyNzA0/YzRmNWZiMjI5YTFm/ZjMzMTQ0YjEzLmpw/Zw",
            "price":90,
            "category":"Veg",
            "status":200
        },
        {
            "id":153,
            "name":"Malai Kofta",
            "image":"https://imgs.search.brave.com/N-iOWIKV-s94rXjtwslYuKcESACxg8yptPEr3U7hsuA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzAwLzQ3LzA0/LzM2MF9GXzkwMDQ3/MDQzN19lT0NIQ3pT/dVNIdU44RlVYaFFt/S05mWHVoSnl2NWQ0/bS5qcGc",
            "price":250,
            "category":"Veg",
            "status":200
        },
        {
            "id":154,
            "name":"Garlic Mushroom",
            "image":"https://imgs.search.brave.com/yfXD6YwYengIVYo56L6agE07N3wMv4FBC1nGIlNB-7o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE2/LzA0L2dhcmxpYy1t/dXNocm9vbS1yZWNp/cGUtMS53ZWJw",
            "price":220,
            "category":"Veg",
            "status":200
        },
        {
            "id":155,
            "name":"Moong Bhaji",
            "image":"https://imgs.search.brave.com/1TCAd9UNjVyG6Iqm9D4e_GxC9lFQQL7KkU4M202P-wk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tYWRo/dXJhc3JlY2lwZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMTAvTW9vbmct/RGFsLUJoYWppLU1h/cmF0aGktUmVjaXBl/LWZlYXR1cmUuanBn",
            "price":95,
            "category":"Veg",
            "status":200
        },
        {
            "id":156,
            "name":"Dal Makhani",
            "image":"https://imgs.search.brave.com/XIziEkqqzxt6634K2S63Zd6t7Fvo8nxhaZWHwJR0s7A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9kYWwtbWFraGFu/aS10cmFkaXRpb25h/bC1pbmRpYW4tc2Vy/dmluZy1ib3dsXzc2/Mjc4NS0yNjU4MjEu/anBnP3NlbXQ9YWlz/X2h5YnJpZA",
            "price":210,
            "category":"Veg",
            "status":200
        },
        {
            "id":157,
            "name":" Cheese potato balls",
            "image":"https://imgs.search.brave.com/XIziEkqqzxt6634K2S63Zd6t7Fvo8nxhaZWHwJR0s7A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9kYWwtbWFraGFu/aS10cmFkaXRpb25h/bC1pbmRpYW4tc2Vy/dmluZy1ib3dsXzc2/Mjc4NS0yNjU4MjEu/anBnP3NlbXQ9YWlz/X2h5YnJpZA",
            "price":200,
            "category":"Veg",
            "status":200
        },
        {
            "id":158,
            "name":"Gajar Halwa",
            "image":"https://imgs.search.brave.com/bmM1MO3G1F9k2qfzYcBZOkEZtdkYSQvXdET2JrB9uXU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aG9uZXl3aGF0c2Nv/b2tpbmcuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIwLzA0/L0dhamFyLWthLUhh/bHdhLUdhanJlbGEt/SW5kaWFuLUNhcnJv/dC1QdWRkaW5nMTUt/NzgweDUxOC5qcGc",
            "price":100,
            "category":"Veg",
            "status":200
        },
        {
            "id":159,
            "name":"Vangych Bharit",
            "image":"https://imgs.search.brave.com/FzVErWbcP3RSIT2HB72i7sgFUeRLWuMZkt4v40bMGR0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hYWhh/YXJhbW9ubGluZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTcvMDEvVmFuZ3lh/Y2hpX0JoYXJpdF9C/YWluZ2FuX0JoYXJ0/YS53ZWJw",
            "price":120,
            "category":"Veg",
            "status":200
        },
        {
            "id":160,
            "name":"Aloo Baigan",
            "image":"https://imgs.search.brave.com/ZW59QVCxqfMQMKVhz7FIk4KBTvypNnnuruUd84V4zNQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tYWRo/dXJhc3JlY2lwZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMTAvVmFuZ2kt/QmF0YXRhLVJhc3Nh/LU1hcmF0aGktUmVj/aXBlLmpwZw",
            "price":150,
            "category":"Veg",
            "status":200
        },
        {
            "id":161,
            "name":"Bread Pakoda",
            "image":"https://imgs.search.brave.com/mnTVxQqORXZNogLjsEa43Swg4U-zaJ5Y3n6PP4NTeQk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzEzLzMyLzY1/LzM2MF9GXzgxMzMy/NjU5M19ac05RYlh5/bWMyMzRTYmRMaTJB/SFJpY2NjOWJ2YnVT/SS5qcGc",
            "price":45,
            "category":"Veg",
            "status":200
        },
        {
            "id":162,
            "name":"Tomato Capsicum Curry",
            "image":"https://imgs.search.brave.com/XR2b7ZygQEPoCxYpLhtxzWdRU17EA6joq7S80Jae8dU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2F5bWVkaWEt/Y29udGVudC5jb20v/LmltYWdlL2NfbGlt/aXQsY3Nfc3JnYixm/bF9wcm9ncmVzc2l2/ZSxxX2F1dG86ZWNv/LHdfNzAwL01UYzBO/REkxTkRBNE5EYzFO/elk0TVRZNC9lYXN5/LXJlY2lwZXMtdG9t/YXRvLWFuZC1jYXBz/aWN1bS1jdXJyeS5q/cGc",
            "price":185,
            "category":"Veg",
            "status":200
        },
        {
            "id":163,
            "name":"Chilli Con Capsicum",
            "image":"https://imgs.search.brave.com/PAa9SWyAUF-mdZAEWsnL_ihAwVzz3buj5dCjngCK9hs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hcGku/cGhvdG9uLmFyZW1l/ZGlhLm5ldC5hdS93/cC1jb250ZW50L3Vw/bG9hZHMvc2l0ZXMv/NC8yMDIwLzEwLzA5/LzMyMDI4L0NoaWxs/aS1jb24tY2Fwc2lj/dW0uanBnP3Jlc2l6/ZT03NjAsNjA4",
            "price":210,
            "category":"Veg",
            "status":200
        },
        {
            "id":164,
            "name":"Chana Paneer",
            "image":"https://imgs.search.brave.com/n020IrZusI20mSrMXLf0QR0bJTdmpSRdhLZ6CbXBbHs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE2/LzA2L2NoYW5hLXBh/bmVlci1tYXNhbGEt/cmVjaXBlLTEzLndl/YnA",
            "price":245,
            "category":"Veg",
            "status":200
        },
        {
            "id":165,
            "name":"Chana Saag Curry",
            "image":"https://imgs.search.brave.com/oM6ny7JMJjMi_9z4A0YRQleR4WBnBEQ77JQu8p_-g3c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5kaWFuaGVhbHRo/eXJlY2lwZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIx/LzA3L2NoYW5hLXNh/YWctcmVjaXBlLndl/YnA",
            "price":255,
            "category":"Veg",
            "status":200
        },
        {
            "id":166,
            "name":"Aamras",
            "image":"https://imgs.search.brave.com/_NqsURj7jw-kbUmurd_rihYwRw9KkGpBfZllvI9eSQ4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Zmxhdm9yc29mbXVt/YmFpLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxMS8wNi9t/YW5nby1wdXJlZS1B/YW1yYXMtUHVyaS1S/ZWNpcGUxLmpwZw",
            "price":150,
            "category":"Veg",
            "status":200
        },
        {
            "id":167,
            "name":"Coconut Chutney",
            "image":"https://imgs.search.brave.com/OOyNjMt1oMHf5HJREX_g1kXZ7t9jg663zncaDn7J4r4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bXJpc2h0YW5uYS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMDEvbmFyaXlh/bC1jaHV0bmV5LW1h/a2luZy5qcGc",
            "price":75,
            "category":"Veg",
            "status":200
        },
        {
            "id":168,
            "name":"Coconut milk pulao",
            "image":"https://imgs.search.brave.com/Nxy8xgWlDKQ9xnefH_PKCkn81H1OJTG876W4m-6Lkjs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vc3BpY2Vh/bmRjb2xvdXIuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzA2L2Fycm96LXB1/bGFvLWNvbi1sZWNo/ZS1kZS1jb2NvLTEu/anBnP2ZpdD0xMTQw/LDc4MSZzc2w9MQ",
            "price":140,
            "category":"Veg",
            "status":200
        },
        {
            "id":169,
            "name":"Tutti Frutti Cake",
            "image":"https://imgs.search.brave.com/fn3jd-hyA6zA4IxAAULwzNmgWhUSjQ_23Xdnu51ktRc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vYWFydGlt/YWRhbi5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjAvMDcv/ZWdnbGVzcy10dXR0/aS1mcnV0dGktY2Fr/ZS1yZWNpcGUuanBn/P3Jlc2l6ZT03NTAs/NDIxJnNzbD0x",
            "price":60,
            "category":"Veg",
            "status":200
        },
        {
            "id":170,
            "name":"Ragi cake",
            "image":"https://imgs.search.brave.com/mDo5zsyh69Zfpu4MHAHtCO5NLotGbZYMqxFKVevQ818/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZHdhcmFrYW9yZ2Fu/aWMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDI0LzA3L1Jh/Z2ktQ2hvY29sYXRl/LUNha2UtUmVjaXBl/LTg3MHg0NzAtMS5q/cGc",
            "price":50,
            "category":"Veg",
            "status":200
        },
        {
            "id":171,
            "name":"Eggless Cupcakes",
            "image":"https://imgs.search.brave.com/AjppATv7ZzbJk1HkrjUQTxiMC8V7S06epz-w4ZwLS90/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jaGVs/c3dlZXRzLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMi8w/Ni9JTUdfOTE5OC1l/ZGl0ZWQtc2NhbGVk/LmpwZw",
            "price":110,
            "category":"Veg",
            "status":200
        },
        {
            "id":172,
            "name":"Muffins",
            "image":"https://imgs.search.brave.com/MX9d4T8u2x7k3jGWgNS3DlK5zmr729v4AtODi3tg9LY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg4/MDI3MzczL3Bob3Rv/L211ZmZpbnMuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPVFO/c1VkQ1dxMS1TOTlt/QVJDZHVyQnhrZWxl/eWlGQ0RaSTNCNHlr/OGlJamM9",
            "price":160,
            "category":"Veg",
            "status":200
        }
 
    ]
};

axios.post('http://localhost:8000/addfooddata', foodData.foodItems)
    .then(response => {
        console.log('Data sent successfully:', response.data);
        alert('Data sccf');
    })
    .catch(error => {
        console.error('Error sending data:', error);
        alert('Not');
    });