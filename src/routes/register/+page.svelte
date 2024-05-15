<svelte:head>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<form method="POST">
    <hgroup>
        <h2>Register</h2>
    </hgroup>

    <label for="username">Mail</label>
    <input type="mail" id="username" name="username" required />

    <label for="password">Password</label>
    <input type="password" id="password" name="password" required />

    <button type="submit">Register</button>
</form>
<p>Already have an account? <a href="/login">Login</a></p>
