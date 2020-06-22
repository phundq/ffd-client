
export default class Storage{
    

    static get(key, defaultValue = null) {
        
        let value = localStorage.getItem(key) || defaultValue
    
        if (value) {
          try {
            value = JSON.parse(value)
          } catch (error) {
            value = defaultValue
          }
        }
    
        return value
      }
    
      static has(key) {
        return localStorage.getItem(key) !== null
      }
    
      static set(key, value) {
        value = JSON.stringify(value)
    
        localStorage.setItem(key, value)
      }
    
      static remove(key) {
        localStorage.removeItem(key)
      }
    
      static clear() {
        localStorage.clear()
      }
      static removeBranchInvoice(branchId = 0){
        if(branchId != 0){
          var invoiceArrayUpdate = Storage.get('invoiceArray');
        invoiceArrayUpdate.map((invoice, index) => {
            if (invoice.branchId === branchId) {
                invoiceArrayUpdate.splice(index, 1);
            }
        })

        if (!invoiceArrayUpdate.length) {
            Storage.remove('invoiceArray');
        }

        localStorage.setItem('invoiceArray', JSON.stringify(invoiceArrayUpdate));
        }


      }

      static addToInvoice(itemId, name, branchId, branchName, image, price, quantity = 1 ){
        var invoiceArray = [];
        let flag = 0;
        if(Storage.has('invoiceArray')){
            invoiceArray = Storage.get('invoiceArray');
        }
        invoiceArray.map(
            invoice => {
                console.log(invoice.invoiceLines)
                if(invoice.branchId == branchId){
                    flag = 1;
                    let flag2 = 0;
                    

                    invoice.invoiceLines.map(invoiceLine => {
                        if(invoiceLine.itemId && invoiceLine.itemId === itemId){
                            flag2 = 1;
                            invoiceLine.quantity += quantity;
                        }
                        
                    })
                    if(flag2 == 0){
                        var newInvoiceLine = {
                            itemId: itemId,
                            name: name,
                            branchId: branchId,
                            branchName: branchName,
                            image: image,
                            price: price,
                            quantity : quantity
                        }
                        invoice.invoiceLines.push(newInvoiceLine);
                    }
                }
            }
         )

        if(flag === 0){
            var newInvoice = {
                branchId: branchId,
                branchName: branchName,
                invoiceLines: [{
                    itemId: itemId,
                    name: name,
                    branchId: branchId,
                    branchName: branchName,
                    image: image,
                    price: price,
                    quantity : quantity
                }
            ]
            }
            invoiceArray.push(newInvoice)
        }

        flag = 0;

            

            localStorage.setItem('invoiceArray', JSON.stringify(invoiceArray));
        
    }
}