"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormWrapper from "../../../components/FormWrapper";

const ValidatePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [code, setCode] = useState(new Array(6).fill("")); // Estado para 6 inputs
    const [error, setError] = useState("");

    const handleInputChange = (value, index) => {
        if (isNaN(value)) return; // Solo permitir números
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus al siguiente input
        if (value && index < 5) {
            document.getElementById(`input-${index + 1}`).focus();
        }
    };

    const handleValidation = async () => {
        const fullCode = code.join(""); // Combinar el código
        if (fullCode.length !== 6) {
            setError("Por favor, ingresa el código completo.");
            return;
        }

        try {
            const token = localStorage.getItem("jwt");
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const url = `${baseUrl}/user/validation`;

            console.log("Enviando código de validación:", { code: fullCode });

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ code: fullCode }),
            });

            if (response.ok) {
                console.log("Validación exitosa");
                router.push(`/auth/login?email=${encodeURIComponent(email)}`);
            } else {
                setError("Código inválido o expirado.");
            }
        } catch (err) {
            console.error("Error al validar el correo:", err);
            setError("Error de red. Intente más tarde.");
        }
    };

    return (
        <FormWrapper title="Enter Verification Code">
            <p className="text-black mb-6 text-center">
                We have just sent a verification code to <strong>{email}</strong>
            </p>
            <div className="flex justify-center gap-2 mb-4">
                {code.map((digit, index) => (
                    <input
                        key={index}
                        id={`input-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleInputChange(e.target.value, index)}
                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-xl text-gray-900"
                    />
                ))}
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <button
                onClick={handleValidation}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition duration-200"
            >
                Verify
            </button>
            <p className="text-black mt-4 text-center">
                <button
                    onClick={() => console.log("Resend code action here")}
                    className="text-blue-500 hover:underline"
                >
                    Resend the code again
                </button>
            </p>
        </FormWrapper>
    );
};

export default ValidatePage;
