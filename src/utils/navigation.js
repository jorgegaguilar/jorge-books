const checkIsNavigationSupported = () => {
    return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
    // aqui hacemos lo que queramos
    // vamos a cargar la página de destino utilizando un fetch para obtener el HTML
    const response = await fetch(url)
    const text = await response.text()
    // quedarnos con el contenido del HTML dentro de la etiqueta body, usamos un regex
    const data = text.match(/<body>([\s\S]*)<\/body>/i)[1]

    return data
}

export const startViewTransition = () => {
    // esto solo lo haremos cuando el navegador lo soporte...
    if (!checkIsNavigationSupported) return

    window.navigation.addEventListener('navigate', (event) => {
        const toUrl = new URL(event.destination.url)

        // revisar si es página externa o no
        if (location.origin !== toUrl.origin) return // si se navega a la página de otro dominio entonces devolvemos un return y nos olvidamos

        // si es una navegacion en el mismo dominio (origen)
        event.intercept({
            async handler () {
                const data = await fetchPage(toUrl.pathname)
                // utilizar la api de View Transition API
                document.startViewTransition(() => {
                    // aquí decimos como hacer la transición, como actualizar la vista
                    // hacemos scroll hacia arriba del todo
                    document.body.innerHTML = data // le machacamos el body con el data que hemos fetcheado
                    document.documentElement.scrollTop = 0
                })
            }
        })
    })
}