
// Item, UI and Storage Controller

// Storage Controller

const StorageCtrl = (()=>{

    
    return {
        
        storeItem: ((item)=>{

            let items;

            if(localStorage.getItem("items") === null){

                items = [];

                items.push(item);

                localStorage.setItem("items", JSON.stringify(items));

                console.log("step-1")
            } else{

                items = JSON.parse(localStorage.getItem("items"));

                items.push(item);

                localStorage.setItem("items", JSON.stringify(items))

                console.log("step-2");
            }
            
        }),

        getItem: ()=>{

            let items;

            if(localStorage.getItem("items") === null){

                items = [];
            } else{

                items = JSON.parse(localStorage.getItem("items"))
            }

            return items;
        },

        deleteItemLS: (id)=>{

            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach((item, index) =>{

                if(item.id === id){

                    items.splice(index, 1)
                }
            })

            localStorage.setItem("items", JSON.stringify(items));
        },

        updateItemLS: (updatedItem)=>{

            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach((item, index)=>{

                if(item.id === updatedItem.id){

                    items.splice(index, 1, updatedItem);
                }
            })

            localStorage.setItem("items", JSON.stringify(items));

        },

        clearItems: ()=>{

            localStorage.removeItem("items");
        }
    }

})();



// Item Controller

const ItemCtrl = (()=>{

    class Items{

        constructor(ID, name, money){

            this.id = ID;
            this.name = name;
            this.money = money;

        }
    } 

    //  Data Structure

    const data = {

        items: StorageCtrl.getItem(),
        currentItem:null,
        totalMoney:0

    }

    return{

        getItem: ()=>{

            return data.items;
        },

        addItem: ((name, money)=>{

            let ID;

            if(data.items.length > 0){

                ID = data.items[data.items.length-1].id+1;

            } else{

                ID = 0;
            }

            money = parseInt(money);

            const newItem = new Items(ID, name, money);

            data.items.push(newItem);

            return newItem;
        }),

        getTotalMoney: ()=>{

            let money = 0;

            data.items.forEach((item)=>{

                money += item.money;
            })

            return money;
        },

        getItemById: ((id)=>{

            let found = 0;

            data.items.forEach((item)=>{

                if(item.id === id){

                    found = item;
                }
            })

            return found;
        }),

        setCurrentItem:((item)=>{

            data.currentItem = item;
        }),

        getCurrentItem: ()=>{

            return data.currentItem;
        },

        deleteItem: ((id)=>{

            const ids= data.items.map((item)=>{

                return item.id

            })

            // get index

            const index = ids.indexOf(id)
            
            // splice the item

            data.items.splice(index, 1);

            
        }),

        updateItem: ((name, money)=>{

            money = parseInt(money);

            let found = null;

            data.items.forEach((item)=>{

                if(item.id === data.currentItem.id){

                    item.name = name;
                    item.money = money;

                    found = item;
                }

            })

            return found;
        }),

        clearItem: ()=>{

            data.items = [];

        }

    }

})();


// UI Controller

const UICtrl = (()=>{

    return{

        populateList: ((items)=>{

            let html = "";

            items.forEach((item)=>{

                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}</strong> : <em>${item.money} rs</em>

                    <a href="#" class="secondary-content">
                        <i class="fa-solid fa-pencil edit-item"></i>
                    </a>
                </li>
                `

                document.querySelector(".collection").innerHTML = html;
            })
        }),

        clearEditState: ()=>{

            document.querySelector(".add-btn").style.display = "inline";
            document.querySelector(".update-btn").style.display = "none";
            document.querySelector(".delete-btn").style.display = "none";
            document.querySelector(".back-btn").style.display = "none";
        },

        showEditState: ()=>{

            document.querySelector(".add-btn").style.display = "none";
            document.querySelector(".update-btn").style.display = "inline";
            document.querySelector(".delete-btn").style.display = "inline";
            document.querySelector(".back-btn").style.display = "inline";

        },

        getItemInput: ()=>{

            return{

                name: document.querySelector("#item-name").value,
                money: document.querySelector("#item-money").value
            }
        },

        addItemList: ((newItem)=>{

            // create element

            const li = document.createElement("li");

            // add class name

            li.className = "collection-item";

            // add id

            li.id = `item-${newItem.id}`;

            // add innerHTML

            li.innerHTML = `
            <strong>${newItem.name}</strong> : <em>${newItem.money} rs</em>

            <a href="#" class="secondary-content">
                <i class="fa-solid fa-pencil edit-item"></i>
            </a>
            `

            document.querySelector("#item-list").appendChild(li);
        }),

        clearInputState: ()=>{

            document.querySelector("#item-name").value = "";
            document.querySelector("#item-money").value = "";
        },

        showTotalMoney:((totalMoney)=>{

            document.querySelector(".total-money").innerText = totalMoney;
        }),

        addItemToForm: ()=>{

            document.querySelector("#item-name").value = ItemCtrl.getCurrentItem().name;
            document.querySelector("#item-money").value = ItemCtrl.getCurrentItem().money;
        },

        updatedItemList: ((updateItem)=>{

            listItems = document.querySelectorAll(".collection-item");

            listItems.forEach((item)=>{

                const itemID = item.id;

                if(itemID === `item-${updateItem.id}`){

                    const li = document.querySelector(`#${itemID}`);

                    li.innerHTML = `
                    <strong>${updateItem.name}</strong> : <em>${updateItem.money} rs</em>

                    <a href="#" class="secondary-content">
                        <i class="fa-solid fa-pencil edit-item"></i>
                    </a>    
                    `
                    
                }
            })

        }),



        deleteItemList: (id)=>{

            const itemID = `item-${id}`;

            const items = document.querySelector(`#${itemID}`);

            items.remove();
        },

        clearItemList: ()=>{

            document.querySelector("#item-list").innerHTML = "";
        },

        showAlert: ((message, color)=>{

            UICtrl.clearAlert();
            // create element

            const h6 = document.createElement("h6");

            // add class name

            h6.className = `alert card-panel white-text ${color}`;

            // add message

            h6.innerText = message;

            document.querySelector(".show-alert").appendChild(h6);
            
            setTimeout(()=>{

                UICtrl.clearAlert();
            }, 3000)
        }),

        clearAlert : ()=>{

            const currentAlert = document.querySelector(".alert");

            if(currentAlert){

                currentAlert.remove();
            }
        }

    }


})();



// App Controller

const App = (()=>{

    const loadEventListener = ()=>{

        document.querySelector(".add-btn").addEventListener("click", itemAddSubmit);

        document.querySelector("#item-list").addEventListener("click", itemEditClick);

        document.querySelector(".delete-btn").addEventListener("click", itemDeleteSubmit);

        document.querySelector(".update-btn").addEventListener("click", itemUpdateSubmit);

        document.querySelector(".clear-btn").addEventListener("click", clearAllItem);

        document.querySelector(".back-btn").addEventListener("click", ()=>{

            UICtrl.clearInputState();

            UICtrl.clearEditState();

        })
    }

    const itemAddSubmit = ()=>{

        const itemInput = UICtrl.getItemInput();

        if(itemInput.name === "" || itemInput.money === ""){

            UICtrl.showAlert("Please fill the fields", "red");
        } else{

            const newItem = ItemCtrl.addItem(itemInput.name, itemInput.money);

            UICtrl.addItemList(newItem);

            UICtrl.clearInputState();

            const totalMoney = ItemCtrl.getTotalMoney();

            UICtrl.showTotalMoney(totalMoney);

            UICtrl.showAlert("Item Added Successfully", "green");

            StorageCtrl.storeItem(newItem);
        }
        
    }




    const itemEditClick = (e)=>{

        if(e.target.classList.contains("edit-item")){

            UICtrl.showEditState();

            const itemID = e.target.parentElement.parentElement.id;

            // split the id in an arr

            const listArr = itemID.split("-");

            // get the id

            const id = parseInt(listArr[1]);

            // get item by the id

            const itemToEdit = ItemCtrl.getItemById(id);

            // set the current item

            ItemCtrl.setCurrentItem(itemToEdit);

            // show in UI

            UICtrl.addItemToForm();
        }
    }


    
    const itemUpdateSubmit = ()=>{

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.money);

        UICtrl.updatedItemList(updatedItem);

        StorageCtrl.updateItemLS(updatedItem);

        UICtrl.clearInputState();

        const totalMoney = ItemCtrl.getTotalMoney();

        UICtrl.showTotalMoney(totalMoney);

        UICtrl.showAlert("Item updated Successfully", "green");
    }




    const itemDeleteSubmit = ()=>{

        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteItemList(currentItem.id);

        StorageCtrl.deleteItemLS(currentItem.id);

        UICtrl.clearInputState();

        const totalMoney = ItemCtrl.getTotalMoney();

        UICtrl.showTotalMoney(totalMoney);

        UICtrl.showAlert("Item deleted Successfully", "green");
    }


    const clearAllItem = ()=>{

        ItemCtrl.clearItem();

        UICtrl.clearItemList();

        StorageCtrl.clearItems();

        const totalMoney = ItemCtrl.getTotalMoney();

        UICtrl.showTotalMoney(totalMoney);

        UICtrl.showAlert("Items Cleared", "green");
    }






    return{

        start: (()=>{

            const items = ItemCtrl.getItem();

            if(items.length > 0){

                UICtrl.populateList(items);

                UICtrl.clearEditState();

                const totalMoney = ItemCtrl.getTotalMoney();

                UICtrl.showTotalMoney(totalMoney);


            }

            UICtrl.clearEditState();


            loadEventListener();
            
        })
    }
})();

App.start();